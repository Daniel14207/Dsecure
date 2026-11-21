import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type StorageMode = 'postgres' | 'redis-kv' | 'local-fs' | 'vercel-ephemeral';

export interface StorageInfo {
  mode: StorageMode;
  persistent: boolean;
  runtime: 'vercel-serverless' | 'node-server';
  blobEnabled: boolean;
  warning: string | null;
}

function resolveSeedDataDir(): string {
  const candidates = [
    path.resolve(process.cwd(), 'server', 'data'),
    path.resolve(__dirname, 'data'),
    path.resolve(__dirname, '..', 'server', 'data'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}

export const SEED_DATA_DIR = resolveSeedDataDir();
export const IS_VERCEL = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

const TMP_DATA_DIR = '/tmp/dsecure-data';
const TMP_BACKUPS_DIR = '/tmp/dsecure-backups';
const TMP_UPLOADS_DIR = '/tmp/dsecure-uploads';

const LOCAL_BACKUPS_DIR = path.join(SEED_DATA_DIR, 'backups');
const LOCAL_UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'images', 'uploads');
const LOCAL_INTERNAL_DIR = path.join(SEED_DATA_DIR, 'internal');

function getPgConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    undefined
  );
}

function getKvConfig(): { url: string; token: string } | undefined {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url: url.replace(/\/+$/, ''), token };
  }
  return undefined;
}

function isLocalDirWritable(dir: string): boolean {
  if (IS_VERCEL) return false;
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export function readSeedJSON<T>(filename: string, fallback: T): T {
  const safeName = path.basename(filename);
  const fullPath = path.resolve(SEED_DATA_DIR, safeName);
  if (!fullPath.startsWith(SEED_DATA_DIR + path.sep) && fullPath !== SEED_DATA_DIR) {
    return fallback;
  }
  try {
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
    }
  } catch (err) {
    console.error(`Error reading seed JSON ${safeName}:`, err);
  }
  return fallback;
}

class DSecureStorage {
  private mode: StorageMode = 'local-fs';
  private pgPool: Pool | null = null;
  private kvConfig: { url: string; token: string } | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.detectMode();
  }

  private detectMode() {
    const pgUrl = getPgConnectionString();
    const kv = getKvConfig();

    if (pgUrl) {
      this.mode = 'postgres';
      const isLocalPg = pgUrl.includes('localhost') || pgUrl.includes('127.0.0.1');
      this.pgPool = new Pool({
        connectionString: pgUrl,
        max: 5,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 10000,
        ssl: isLocalPg ? false : { rejectUnauthorized: false },
      });
    } else if (kv) {
      this.mode = 'redis-kv';
      this.kvConfig = kv;
    } else if (isLocalDirWritable(SEED_DATA_DIR)) {
      this.mode = 'local-fs';
      [LOCAL_BACKUPS_DIR, LOCAL_UPLOADS_DIR].forEach((d) => {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      });
    } else {
      this.mode = 'vercel-ephemeral';
      [TMP_DATA_DIR, TMP_BACKUPS_DIR, TMP_UPLOADS_DIR].forEach((d) => {
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      });
    }
  }

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.performInit().catch((err) => {
      this.initPromise = null;
      throw err;
    });
    return this.initPromise;
  }

  private async performInit(): Promise<void> {
    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query(`
        CREATE TABLE IF NOT EXISTS dsecure_store (
          key TEXT PRIMARY KEY,
          value JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
    }
  }

  getInfo(): StorageInfo {
    const blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const runtime: 'vercel-serverless' | 'node-server' = IS_VERCEL
      ? 'vercel-serverless'
      : 'node-server';

    if (this.mode === 'vercel-ephemeral') {
      return {
        mode: this.mode,
        persistent: false,
        runtime,
        blobEnabled,
        warning:
          'Mode sans base de données persistante détecté sur Vercel : configurez DATABASE_URL (PostgreSQL) ou KV_REST_API_URL + KV_REST_API_TOKEN (Upstash Redis) dans les variables d’environnement Vercel pour conserver vos modifications après redémarrage.',
      };
    }

    return {
      mode: this.mode,
      persistent: true,
      runtime,
      blobEnabled,
      warning: null,
    };
  }

  private getFilePathForKey(key: string): string {
    const baseDir = this.mode === 'local-fs' ? SEED_DATA_DIR : TMP_DATA_DIR;
    const safeKey = key.replace(/[^a-zA-Z0-9._-]/g, '_');
    const resolved = path.resolve(baseDir, `${safeKey}.json`);
    if (!resolved.startsWith(baseDir + path.sep)) {
      throw new Error('Invalid storage key path');
    }
    return resolved;
  }

  private async kvCommand<T = unknown>(args: (string | number)[]): Promise<T | null> {
    if (!this.kvConfig) return null;
    const res = await fetch(this.kvConfig.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.kvConfig.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`KV error HTTP ${res.status}: ${txt}`);
    }
    const json = (await res.json()) as { result?: T; error?: string };
    if (json.error) throw new Error(json.error);
    return json.result ?? null;
  }

  async getJSON<T>(key: string, seedFilename?: string, fallback?: T): Promise<T> {
    await this.init();

    if (this.mode === 'postgres' && this.pgPool) {
      const { rows } = await this.pgPool.query<{ value: T }>(
        'SELECT value FROM dsecure_store WHERE key = $1',
        [key]
      );
      if (rows.length > 0) return rows[0].value;
      const seedVal = seedFilename
        ? readSeedJSON<T>(seedFilename, fallback as T)
        : (fallback as T);
      if (seedVal !== undefined && seedVal !== null) {
        await this.setJSON(key, seedVal);
      }
      return seedVal;
    }

    if (this.mode === 'redis-kv') {
      const raw = await this.kvCommand<string | null>(['GET', `dsecure:${key}`]);
      if (raw !== null && raw !== undefined) {
        return typeof raw === 'string' ? (JSON.parse(raw) as T) : (raw as T);
      }
      const seedVal = seedFilename
        ? readSeedJSON<T>(seedFilename, fallback as T)
        : (fallback as T);
      if (seedVal !== undefined && seedVal !== null) {
        await this.setJSON(key, seedVal);
      }
      return seedVal;
    }

    if (this.mode === 'local-fs') {
      const targetName = seedFilename ? path.basename(seedFilename) : `${key}.json`;
      const fullPath = path.resolve(SEED_DATA_DIR, targetName);
      if (fullPath.startsWith(SEED_DATA_DIR + path.sep) && fs.existsSync(fullPath)) {
        try {
          return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
        } catch (err) {
          console.error(`Error loading ${targetName}:`, err);
        }
      }
      return fallback as T;
    }

    // vercel-ephemeral: check /tmp first, then read-only bundled seed
    const tmpPath = this.getFilePathForKey(key);
    if (fs.existsSync(tmpPath)) {
      try {
        return JSON.parse(fs.readFileSync(tmpPath, 'utf-8')) as T;
      } catch {}
    }
    return seedFilename
      ? readSeedJSON<T>(seedFilename, fallback as T)
      : (fallback as T);
  }

  async setJSON(key: string, value: unknown, seedFilename?: string): Promise<void> {
    await this.init();

    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query(
        `INSERT INTO dsecure_store (key, value, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, JSON.stringify(value)]
      );
      return;
    }

    if (this.mode === 'redis-kv') {
      await this.kvCommand(['SET', `dsecure:${key}`, JSON.stringify(value)]);
      return;
    }

    if (this.mode === 'local-fs') {
      const targetName = seedFilename ? path.basename(seedFilename) : `${key}.json`;
      const fullPath = path.resolve(SEED_DATA_DIR, targetName);
      if (!fullPath.startsWith(SEED_DATA_DIR + path.sep)) {
        throw new Error('Invalid local data path');
      }
      fs.writeFileSync(fullPath, JSON.stringify(value, null, 2), 'utf-8');
      return;
    }

    // vercel-ephemeral -> /tmp
    const tmpPath = this.getFilePathForKey(key);
    fs.writeFileSync(tmpPath, JSON.stringify(value, null, 2), 'utf-8');
  }

  async setJSONWithTTL(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.init();
    const wrapped = { value, expiresAt: Date.now() + ttlSeconds * 1000 };

    if (this.mode === 'redis-kv') {
      await this.kvCommand(['SET', `dsecure:${key}`, JSON.stringify(wrapped), 'EX', ttlSeconds]);
      return;
    }
    await this.setJSON(key, wrapped);
  }

  async getJSONWithTTL<T>(key: string): Promise<T | null> {
    await this.init();
    let wrapped: { value: T; expiresAt?: number } | null = null;

    if (this.mode === 'postgres' && this.pgPool) {
      const { rows } = await this.pgPool.query<{ value: { value: T; expiresAt?: number } }>(
        'SELECT value FROM dsecure_store WHERE key = $1',
        [key]
      );
      if (rows.length > 0) wrapped = rows[0].value;
    } else if (this.mode === 'redis-kv') {
      const raw = await this.kvCommand<string | null>(['GET', `dsecure:${key}`]);
      if (raw) {
        wrapped = typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    } else {
      const filePath = this.getFilePathForKey(key);
      if (fs.existsSync(filePath)) {
        try {
          wrapped = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch {}
      }
    }

    if (!wrapped) return null;
    if (wrapped.expiresAt && Date.now() > wrapped.expiresAt) {
      await this.deleteKey(key);
      return null;
    }
    return wrapped.value;
  }

  async deleteKey(key: string): Promise<void> {
    await this.init();
    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query('DELETE FROM dsecure_store WHERE key = $1', [key]);
      return;
    }
    if (this.mode === 'redis-kv') {
      await this.kvCommand(['DEL', `dsecure:${key}`]);
      return;
    }
    try {
      const filePath = this.getFilePathForKey(key);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {}
  }

  // -------------------------------------------------------------
  // TOKEN SIGNING SECRET (Consistent across Vercel instances)
  // -------------------------------------------------------------
  async getOrCreateTokenSecret(): Promise<string> {
    if (process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.trim().length >= 16) {
      return process.env.ADMIN_SECRET.trim();
    }
    const existing = await this.getJSON<{ secret: string } | null>('system_token_secret', undefined, null);
    if (existing?.secret) return existing.secret;

    const generated = crypto.randomBytes(32).toString('hex');
    await this.setJSON('system_token_secret', { secret: generated, createdAt: new Date().toISOString() });
    return generated;
  }

  // -------------------------------------------------------------
  // UPLOADED IMAGES (Local disk / Vercel Blob / DB Media Store)
  // -------------------------------------------------------------
  async saveUploadedImage(filename: string, mimeType: string, buffer: Buffer): Promise<string> {
    // 1) Vercel Blob CDN if configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const uploadRes = await fetch(
        `https://blob.vercel-storage.com/uploads/${encodeURIComponent(filename)}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            'content-type': mimeType,
            'x-api-version': '7',
          },
          body: new Uint8Array(buffer),
        }
      );
      if (uploadRes.ok) {
        const blobJson = (await uploadRes.json()) as { url?: string };
        if (blobJson.url) {
          const mediaIndex = await this.getJSON<Array<{ path: string; name: string }>>(
            'uploaded_media_index',
            undefined,
            []
          );
          mediaIndex.unshift({ path: blobJson.url, name: filename });
          await this.setJSON('uploaded_media_index', mediaIndex.slice(0, 200));
          return blobJson.url;
        }
      }
    }

    // 2) Local writable disk (AI Studio / Node server)
    if (this.mode === 'local-fs') {
      const safeName = path.basename(filename);
      const destPath = path.resolve(LOCAL_UPLOADS_DIR, safeName);
      if (!destPath.startsWith(LOCAL_UPLOADS_DIR + path.sep)) {
        throw new Error('Chemin de fichier invalide');
      }
      fs.writeFileSync(destPath, buffer);
      return `/images/uploads/${safeName}`;
    }

    // 3) Serverless DB / tmp media fallback served via GET /api/media/:filename
    const safeName = path.basename(filename);
    await this.setJSON(`media_${safeName}`, {
      filename: safeName,
      mimeType,
      dataBase64: buffer.toString('base64'),
      createdAt: new Date().toISOString(),
    });
    const mediaIndex = await this.getJSON<Array<{ path: string; name: string }>>(
      'uploaded_media_index',
      undefined,
      []
    );
    const webPath = `/api/media/${safeName}`;
    mediaIndex.unshift({ path: webPath, name: safeName });
    await this.setJSON('uploaded_media_index', mediaIndex.slice(0, 200));
    return webPath;
  }

  async getUploadedMedia(filename: string): Promise<{ mimeType: string; buffer: Buffer } | null> {
    const safeName = path.basename(filename);
    const stored = await this.getJSON<{ mimeType: string; dataBase64: string } | null>(
      `media_${safeName}`,
      undefined,
      null
    );
    if (stored?.dataBase64) {
      return {
        mimeType: stored.mimeType || 'image/jpeg',
        buffer: Buffer.from(stored.dataBase64, 'base64'),
      };
    }
    const localPath = path.resolve(LOCAL_UPLOADS_DIR, safeName);
    if (localPath.startsWith(LOCAL_UPLOADS_DIR + path.sep) && fs.existsSync(localPath)) {
      const ext = path.extname(safeName).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return { mimeType, buffer: fs.readFileSync(localPath) };
    }
    return null;
  }

  async listAvailableImages(usageMap: Record<string, string[]>): Promise<
    Array<{ path: string; name: string; category: string; usedBy: string[] }>
  > {
    const result: Array<{ path: string; name: string; category: string; usedBy: string[] }> = [];
    const seen = new Set<string>();

    const addImg = (webPath: string, name: string, category: string) => {
      if (seen.has(webPath)) return;
      seen.add(webPath);
      result.push({
        path: webPath,
        name,
        category,
        usedBy: usageMap[webPath] || [],
      });
    };

    // Dynamic uploaded images stored via API/Blob
    const uploadedIndex = await this.getJSON<Array<{ path: string; name: string }>>(
      'uploaded_media_index',
      undefined,
      []
    );
    for (const item of uploadedIndex) {
      addImg(item.path, item.name, 'Images Importées');
    }

    // Dynamic scan on local writable filesystem, otherwise build manifest for Vercel
    const publicImagesDir = path.resolve(process.cwd(), 'public', 'images');
    const aistudioDir = path.resolve(process.cwd(), 'public', 'assets', 'aistudio');

    const scanDir = (dir: string, baseWebPath: string, catName: string) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        if (ent.isDirectory()) {
          scanDir(path.join(dir, ent.name), `${baseWebPath}/${ent.name}`, ent.name);
        } else if (/\.(jpe?g|png|webp|jfif)$/i.test(ent.name)) {
          addImg(`${baseWebPath}/${ent.name}`, ent.name, catName);
        }
      }
    };

    if (!IS_VERCEL && (fs.existsSync(publicImagesDir) || fs.existsSync(aistudioDir))) {
      scanDir(publicImagesDir, '/images', 'Catalogue Hikvision');
      scanDir(aistudioDir, '/assets/aistudio', 'Photos D SECURE');
    } else {
      const manifest = readSeedJSON<Array<{ path: string; name: string; category: string }>>(
        'images-manifest.json',
        []
      );
      for (const m of manifest) {
        addImg(m.path, m.name, m.category);
      }
    }

    return result;
  }

  // -------------------------------------------------------------
  // BACKUPS MANAGEMENT (Local Filesystem + DB Index)
  // -------------------------------------------------------------
  async createBackup(payload: Record<string, unknown>): Promise<string> {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${stamp}.json`;
    const serialized = JSON.stringify(payload, null, 2);

    if (this.mode === 'local-fs') {
      const filePath = path.resolve(LOCAL_BACKUPS_DIR, filename);
      if (filePath.startsWith(LOCAL_BACKUPS_DIR + path.sep)) {
        fs.writeFileSync(filePath, serialized, 'utf-8');
        try {
          const files = fs.readdirSync(LOCAL_BACKUPS_DIR).filter((f) => f.endsWith('.json')).sort();
          while (files.length > 25) {
            const oldest = files.shift();
            if (oldest) fs.unlinkSync(path.join(LOCAL_BACKUPS_DIR, oldest));
          }
        } catch {}
      }
      return filename;
    }

    // Store snapshot metadata & payload in DB / tmp
    const index = await this.getJSON<Array<{ name: string; sizeFormatted: string; createdAt: string }>>(
      'backups_index',
      undefined,
      []
    );
    await this.setJSON(`backup_${filename}`, payload);
    index.unshift({
      name: filename,
      sizeFormatted: `${(Buffer.byteLength(serialized, 'utf-8') / 1024).toFixed(1)} KB`,
      createdAt: new Date().toISOString(),
    });
    const removed = index.splice(25);
    for (const old of removed) {
      await this.deleteKey(`backup_${old.name}`);
    }
    await this.setJSON('backups_index', index);
    return filename;
  }

  async listBackups(): Promise<Array<{ name: string; sizeFormatted: string; createdAt: string | Date }>> {
    if (this.mode === 'local-fs') {
      if (!fs.existsSync(LOCAL_BACKUPS_DIR)) return [];
      return fs
        .readdirSync(LOCAL_BACKUPS_DIR)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse()
        .map((name) => {
          const stat = fs.statSync(path.join(LOCAL_BACKUPS_DIR, name));
          return {
            name,
            sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
            createdAt: stat.mtime,
          };
        });
    }
    return this.getJSON<Array<{ name: string; sizeFormatted: string; createdAt: string }>>(
      'backups_index',
      undefined,
      []
    );
  }

  getInternalFiles(): Array<{ name: string; sizeBytes: number; sizeFormatted: string; modifiedAt: Date }> {
    if (!fs.existsSync(LOCAL_INTERNAL_DIR)) return [];
    return fs.readdirSync(LOCAL_INTERNAL_DIR).map((name) => {
      const filePath = path.resolve(LOCAL_INTERNAL_DIR, path.basename(name));
      const stat = fs.statSync(filePath);
      return {
        name,
        sizeBytes: stat.size,
        sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
        modifiedAt: stat.mtime,
      };
    });
  }

  resolveInternalFile(filename: string): string | null {
    const safeName = path.basename(filename);
    const fullPath = path.resolve(LOCAL_INTERNAL_DIR, safeName);
    if (!fullPath.startsWith(LOCAL_INTERNAL_DIR + path.sep) || !fs.existsSync(fullPath)) {
      return null;
    }
    return fullPath;
  }

  syncPublicProductsFile(publicProducts: unknown[]): void {
    if (this.mode !== 'local-fs') return;
    try {
      const publicPath = path.resolve(process.cwd(), 'src', 'data', 'products.json');
      fs.writeFileSync(publicPath, JSON.stringify(publicProducts, null, 2), 'utf-8');
    } catch {}
  }
}

export const storage = new DSecureStorage();
