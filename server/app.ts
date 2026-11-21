import express, { Request, Response, NextFunction, Express } from 'express';
import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';
import { storage, readSeedJSON } from './storage.ts';

dotenv.config();

const DEFAULT_CATEGORIES = [
  { id: 'cat-cameras', name: 'Caméras de Surveillance', topSection: 'cameras', description: 'Caméras IP AcuSense, ColorVu, analogiques Turbo HD, PTZ motorisées et caméras solaires 4G', image: '/images/CAMERAS_IP/CAMERAS_IP__DS-2CD1023G2-LIU.jpg', isActive: true, order: 1 },
  { id: 'cat-alarms', name: "Systèmes d'Alarme", topSection: 'alarms', description: 'Protection sans fil et filaire AX PRO, PIRCAM, claviers et sirènes 110dB', image: '/images/ALARMES_SANS_FIL/ALARMES_SANS_FIL__DS-PWA64-Kit-WB-O-STD.jpg', isActive: true, order: 2 },
  { id: 'cat-packs', name: 'Kits & Packs Vidéosurveillance', topSection: 'packs', description: 'Solutions clés en main prêtes à installer avec caméras, enregistreur et pose offerte', image: '/images/packs/pack_ip_poe_4.jpg', isActive: true, order: 3 },
  { id: 'cat-dvr-nvr', name: 'Enregistreurs DVR & NVR', topSection: 'dvr_nvr', description: 'Enregistreurs numériques haute performance avec compression H.265+ et ports PoE', image: '/images/NVR/NVR__DS-7104NI-Q1-4P-M.jpg', isActive: true, order: 4 },
  { id: 'cat-accessories', name: 'Accessoires & Câblage', topSection: 'accessories', description: 'Câbles coaxiaux KX6, cordons RJ45, connecteurs BNC, boîtiers étanches et supports', image: '/images/ACCESSOIRES/ACCESSOIRES__DS-1280ZJ-XS.jpg', isActive: true, order: 5 },
  { id: 'cat-hdd', name: 'Disques Durs de Surveillance', topSection: 'hdd', description: 'Disques internes certifiés Seagate SkyHawk et WD Purple pour écriture 24/7', image: '/images/DISQUES_DURS/DISQUES_DURS__A_IDENTIFIER.png', isActive: true, order: 6 },
  { id: 'cat-network', name: 'Réseau & Switchs PoE', topSection: 'network', description: 'Switchs PoE industriels, routeurs 4G longue portée et ponts sans fil', image: '/images/SWITCH_POE/SWITCH_POE__DS-3E0505P-E-M.png', isActive: true, order: 7 },
  { id: 'cat-monitors', name: 'Moniteurs & Écrans', topSection: 'monitors', description: 'Écrans professionnels de vidéosurveillance Full HD et 4K', image: '/images/MONITEURS/MONITEURS__DS-D5024FN.jpg', isActive: true, order: 8 },
];

interface AdminAuthStore {
  salt: string;
  passwordHash: string;
  updatedAt: string;
}

interface AnalyticsStore {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitorsCount: number;
  visitorHashes: string[];
  lastDate: string;
  pageViews: Record<string, number>;
  categoryViews: Record<string, number>;
  productViews: Record<string, number>;
  dailyVisits: Array<{ date: string; visits: number }>;
  monthlyVisits: Array<{ month: string; visits: number }>;
  lastVisitedAt: string | null;
}

interface LoginAttemptInfo {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

interface SignedTokenPayload {
  v: number;
  role: 'administrator';
  jti: string;
  iat: number;
  exp: number;
}

const SESSION_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_TOKEN_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours max lifetime

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function getClientIp(req: Request): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function hashPasswordScrypt(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function normalizeRef(ref: string): string {
  return (ref || '')
    .toUpperCase()
    .replace(/\((O-STD|STD|C|EUR|F1|S7|T5)\)/g, '')
    .replace(/\([^)]*MM\)/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9\-\/]/g, '');
}

function validatePackTechnologySeparation(pack: any): string | null {
  const family = pack.family;
  if (family !== 'analog' && family !== 'ip') {
    return 'La famille du pack doit être strictement "analog" ou "ip".';
  }
  const bom = Array.isArray(pack.bom) ? pack.bom : [];
  for (const item of bom) {
    const text = `${item.ref || ''} ${item.name || ''} ${item.category || ''}`.toUpperCase();
    if (family === 'analog') {
      if (
        text.includes('NVR') ||
        text.includes('RJ45') ||
        text.includes('CAT6') ||
        text.includes('CAMÉRAS IP') ||
        text.includes('DS-2CD')
      ) {
        return `Incompatibilité technique détectée dans ce pack Analogique : le composant "${item.name}" (${item.ref}) appartient à la technologie IP Numérique.`;
      }
    } else if (family === 'ip') {
      if (
        text.includes('DVR') ||
        text.includes('BNC') ||
        text.includes('COAXIAL') ||
        text.includes('TURBO HD') ||
        text.includes('DS-2CE') ||
        text.includes('DS-720')
      ) {
        return `Incompatibilité technique détectée dans ce pack IP Numérique : le composant "${item.name}" (${item.ref}) appartient à la technologie Analogique.`;
      }
    }
  }
  return null;
}

function findMatchingCatalogProduct(masterProducts: any[], bomRef: string): any | undefined {
  if (!bomRef) return undefined;
  const exact = masterProducts.find(
    (p) => (p.reference || '').toUpperCase() === bomRef.toUpperCase()
  );
  if (exact) return exact;

  const normTarget = normalizeRef(bomRef);
  if (!normTarget || normTarget.length < 5) return undefined;

  return masterProducts.find((p) => {
    const normProd = normalizeRef(p.reference || '');
    return (
      normProd === normTarget ||
      normProd.startsWith(normTarget) ||
      normTarget.startsWith(normProd)
    );
  });
}

function computePackTotals(masterProducts: any[], pack: any, syncCatalogPrices = false): any {
  const updatedBom = (Array.isArray(pack.bom) ? pack.bom : []).map((item: any) => {
    let unitPriceAr = Number(item.unitPriceAr) || 0;
    if (syncCatalogPrices && !item.isOffered) {
      const catalogMatch = findMatchingCatalogProduct(masterProducts, item.ref);
      if (
        catalogMatch &&
        typeof catalogMatch.sellingPriceAr === 'number' &&
        catalogMatch.sellingPriceAr > 0
      ) {
        unitPriceAr = catalogMatch.sellingPriceAr;
      }
    }
    const quantity = Number(item.quantity) || 1;
    const totalPriceAr = item.isOffered ? 0 : unitPriceAr * quantity;
    return {
      ...item,
      quantity,
      unitPriceAr,
      totalPriceAr,
    };
  });

  const basePackTotalAr = updatedBom.reduce(
    (acc: number, item: any) => acc + (Number(item.totalPriceAr) || 0),
    0
  );
  const roundedTotal = Math.round(basePackTotalAr / 1000) * 1000 || basePackTotalAr;
  const displayTotal = pack.totalPriceAr && !syncCatalogPrices ? Number(pack.totalPriceAr) : roundedTotal;

  return {
    ...pack,
    bom: updatedBom,
    basePackTotalAr,
    totalPriceAr: syncCatalogPrices ? roundedTotal : displayTotal,
    formattedPrice: `${new Intl.NumberFormat('fr-FR').format(
      syncCatalogPrices ? roundedTotal : displayTotal
    )} Ar`,
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeProductsForPublic(masterProducts: any[]) {
  return [...masterProducts]
    .sort((a, b) => {
      const oa = typeof a.displayOrder === 'number' ? a.displayOrder : Number.MAX_SAFE_INTEGER;
      const ob = typeof b.displayOrder === 'number' ? b.displayOrder : Number.MAX_SAFE_INTEGER;
      return oa - ob;
    })
    .map((p) => ({
      id: p.id,
      category: p.category,
      name: p.name,
      reference: p.reference,
      description: p.description,
      sellingPriceAr: p.sellingPriceAr,
      formattedPrice:
        p.formattedPrice ||
        (p.sellingPriceAr
          ? `${new Intl.NumberFormat('fr-FR').format(p.sellingPriceAr)} Ar`
          : 'Prix sur demande'),
      currency: p.currency || 'Ar',
      image: p.image || null,
      images: p.images || (p.image ? [p.image] : []),
      topSection: p.topSection,
      isAvailable: p.isAvailable !== false,
      displayOrder: p.displayOrder,
      updatedAt: p.updatedAt || new Date().toISOString(),
    }));
}

let cachedAppPromise: Promise<Express> | null = null;

export function getApp(): Promise<Express> {
  if (!cachedAppPromise) {
    cachedAppPromise = createDsecureApp().catch((err) => {
      cachedAppPromise = null;
      throw err;
    });
  }
  return cachedAppPromise;
}

export async function createDsecureApp(): Promise<Express> {
  const app = express();
  app.set('trust proxy', 1);

  await storage.init();
  const tokenSecret = await storage.getOrCreateTokenSecret();

  // Seed & load auth store without writing to read-only bundle
  const envAdminPassword = process.env.ADMIN_PASSWORD?.trim();
  const bundledAuth = readSeedJSON<AdminAuthStore | null>('.admin-auth.json', null);

  async function verifyAdminPassword(candidate: string): Promise<boolean> {
    if (envAdminPassword) {
      const salt = crypto.createHash('sha256').update(tokenSecret).digest('hex').slice(0, 32);
      const expected = hashPasswordScrypt(envAdminPassword, salt);
      const actual = hashPasswordScrypt(candidate, salt);
      return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(actual, 'hex'));
    }

    const dbAuth = await storage.getJSON<AdminAuthStore | null>('admin_auth', '.admin-auth.json', bundledAuth);
    const activeAuth = dbAuth || bundledAuth;
    if (!activeAuth?.salt || !activeAuth?.passwordHash) {
      return false;
    }

    try {
      const candidateHash = hashPasswordScrypt(candidate, activeAuth.salt);
      const bufA = Buffer.from(candidateHash, 'hex');
      const bufB = Buffer.from(activeAuth.passwordHash, 'hex');
      return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  }

  // Stateless HMAC-SHA256 Token signing & verification (works across Vercel serverless cold starts)
  function signSessionToken(jti: string, now: number): string {
    const payload: SignedTokenPayload = {
      v: 1,
      role: 'administrator',
      jti,
      iat: now,
      exp: now + MAX_TOKEN_LIFETIME_MS,
    };
    const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    const sig = crypto.createHmac('sha256', tokenSecret).update(encoded).digest('base64url');
    return `${encoded}.${sig}`;
  }

  function verifySignedToken(token: string): SignedTokenPayload | null {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', tokenSecret).update(encoded).digest('base64url');
    const bufA = Buffer.from(sig, 'utf8');
    const bufB = Buffer.from(expectedSig, 'utf8');
    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return null;
    }
    try {
      const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SignedTokenPayload;
      if (payload.role !== 'administrator' || !payload.jti || !payload.exp) return null;
      if (Date.now() > payload.exp) return null;
      return payload;
    } catch {
      return null;
    }
  }

  // CORS handling: restrict to matching host/origin, never wildcard on authenticated APIs
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '') as string;
    const appUrl = process.env.APP_URL || '';

    if (origin) {
      let allowed = false;
      try {
        const originUrl = new URL(origin);
        if (host && originUrl.host === host) allowed = true;
        if (appUrl && origin === appUrl.replace(/\/+$/, '')) allowed = true;
        if (originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1') allowed = true;
        if (originUrl.hostname.endsWith('.vercel.app') && host.endsWith('.vercel.app')) allowed = true;
      } catch {}

      if (allowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      }
    }

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Preserve pre-parsed body on Vercel @vercel/node while still parsing standard Express streams
  app.use((req: any, _res: Response, next: NextFunction) => {
    if (req.body !== undefined && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      req._body = true;
    }
    next();
  });
  app.use(express.json({ limit: '4.5mb' }));

  // Security middleware: explicitly block direct access to sensitive extensions or server internals
  app.use((req: Request, res: Response, next: NextFunction) => {
    const lowerPath = req.path.toLowerCase();
    if (
      lowerPath.endsWith('.csv') ||
      lowerPath.endsWith('.tsv') ||
      lowerPath.endsWith('.xlsx') ||
      lowerPath.endsWith('.xls') ||
      lowerPath.startsWith('/server/') ||
      lowerPath.includes('/.admin-')
    ) {
      res.status(404).json({ error: 'Ressource non trouvée ou accès restreint.' });
      return;
    }
    next();
  });

  // Data accessors backed by unified storage
  const getProducts = () => storage.getJSON<any[]>('master_products', 'master-products.json', []);
  const saveProducts = async (list: any[]) => {
    await storage.setJSON('master_products', list, 'master-products.json');
    storage.syncPublicProductsFile(sanitizeProductsForPublic(list));
  };

  const getPacks = () => storage.getJSON<any[]>('packs', 'packs.json', []);
  const savePacks = (list: any[]) => storage.setJSON('packs', list, 'packs.json');

  const getOrders = () => storage.getJSON<any[]>('orders', 'orders.json', []);
  const saveOrders = (list: any[]) => storage.setJSON('orders', list, 'orders.json');

  const getAuditLogs = () => storage.getJSON<any[]>('audit_logs', 'audit-logs.json', []);
  const saveAuditLogs = (list: any[]) => storage.setJSON('audit_logs', list, 'audit-logs.json');

  const getCategories = async () => {
    const cats = await storage.getJSON<any[]>('categories', 'categories.json', []);
    if (!Array.isArray(cats) || cats.length === 0) {
      await storage.setJSON('categories', DEFAULT_CATEGORIES, 'categories.json');
      return [...DEFAULT_CATEGORIES];
    }
    return cats;
  };
  const saveCategories = (list: any[]) => storage.setJSON('categories', list, 'categories.json');

  const getAnalytics = async (): Promise<AnalyticsStore> => {
    const today = new Date().toISOString().split('T')[0];
    return storage.getJSON<AnalyticsStore>('analytics', 'analytics.json', {
      totalVisits: 0,
      todayVisits: 0,
      uniqueVisitorsCount: 0,
      visitorHashes: [],
      lastDate: today,
      pageViews: {},
      categoryViews: {},
      productViews: {},
      dailyVisits: [{ date: today, visits: 0 }],
      monthlyVisits: [{ month: today.slice(0, 7), visits: 0 }],
      lastVisitedAt: null,
    });
  };
  const saveAnalytics = (ana: AnalyticsStore) => storage.setJSON('analytics', ana, 'analytics.json');

  async function logAudit(
    action: string,
    entityId: string,
    entityName: string,
    details: string,
    user = 'Direction D SECURE'
  ) {
    const logs = await getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      entityId,
      entityName,
      details,
      user,
    });
    if (logs.length > 500) logs.length = 500;
    await saveAuditLogs(logs);
  }

  async function createBackupSnapshot(reason: string): Promise<string> {
    const [products, packs, orders, categories] = await Promise.all([
      getProducts(),
      getPacks(),
      getOrders(),
      getCategories(),
    ]);
    return storage.createBackup({
      createdAt: new Date().toISOString(),
      reason,
      productsCount: products.length,
      packsCount: packs.length,
      ordersCount: orders.length,
      products,
      packs,
      orders,
      categories,
    });
  }

  async function recalculateAllPacks(masterProducts: any[]) {
    const packs = await getPacks();
    const updated = packs.map((pk) => computePackTotals(masterProducts, pk, true));
    await savePacks(updated);
    return updated;
  }

  // Auth middleware verifying signed token + revocation + 30 min inactivity
  const requireAdminAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;

    if (!token) {
      res.status(401).json({ error: 'Authentification administrateur requise.' });
      return;
    }

    const payload = verifySignedToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
      return;
    }

    const revoked = await storage.getJSONWithTTL<{ revokedAt: number }>(`revoked_${payload.jti}`);
    if (revoked) {
      res.status(401).json({
        error: 'Session fermée. Veuillez vous reconnecter.',
        code: 'SESSION_EXPIRED',
      });
      return;
    }

    const sessionRecord = await storage.getJSONWithTTL<{ lastActiveAt: number }>(`session_${payload.jti}`);
    if (sessionRecord && Date.now() - sessionRecord.lastActiveAt > SESSION_INACTIVITY_TIMEOUT_MS) {
      await storage.setJSONWithTTL(`revoked_${payload.jti}`, { revokedAt: Date.now() }, 8 * 3600);
      await storage.deleteKey(`session_${payload.jti}`);
      res.status(401).json({
        error: "Session expirée après 30 minutes d'inactivité pour des raisons de sécurité. Veuillez vous reconnecter.",
        code: 'SESSION_EXPIRED',
      });
      return;
    }

    await storage.setJSONWithTTL(
      `session_${payload.jti}`,
      { lastActiveAt: Date.now() },
      Math.ceil(SESSION_INACTIVITY_TIMEOUT_MS / 1000)
    );
    (req as any).adminSession = payload;
    next();
  });

  // ==========================================
  // 1. PUBLIC API ROUTES (Zero Confidential Data)
  // ==========================================

  app.get(
    '/api/products',
    asyncHandler(async (_req: Request, res: Response) => {
      const products = await getProducts();
      const publicList = sanitizeProductsForPublic(products);
      res.setHeader('Cache-Control', 'no-store');
      res.json({
        success: true,
        count: publicList.length,
        products: publicList,
      });
    })
  );

  app.get(
    '/api/categories',
    asyncHandler(async (_req: Request, res: Response) => {
      const cats = await getCategories();
      const publicCats = [...cats]
        .filter((c) => c.isActive !== false)
        .sort((a, b) => (a.order || 99) - (b.order || 99));
      res.setHeader('Cache-Control', 'no-store');
      res.json({
        success: true,
        categories: publicCats,
      });
    })
  );

  app.get(
    '/api/packs',
    asyncHandler(async (_req: Request, res: Response) => {
      const packs = await getPacks();
      const publicPacks = packs.filter((pk) => pk.isActive !== false);
      res.setHeader('Cache-Control', 'no-store');
      res.json({
        success: true,
        count: publicPacks.length,
        packs: publicPacks,
      });
    })
  );

  // Serve dynamically uploaded media in serverless/cloud DB deployments
  app.get(
    '/api/media/:filename',
    asyncHandler(async (req: Request, res: Response) => {
      const media = await storage.getUploadedMedia(req.params.filename);
      if (!media) {
        res.status(404).json({ error: 'Image non trouvée.' });
        return;
      }
      res.setHeader('Content-Type', media.mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.send(media.buffer);
    })
  );

  app.post(
    '/api/orders',
    asyncHandler(async (req: Request, res: Response) => {
      const { customer, items, totalAmountAr } = req.body || {};

      if (!customer || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Données de commande invalides.' });
        return;
      }

      const orders = await getOrders();
      const orderCount = orders.length + 1;
      const orderNumber = `CMD-2026-${String(orderCount).padStart(3, '0')}`;
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customer: {
          fullName: String(customer.fullName || 'Client D SECURE').trim(),
          phone: String(customer.phone || '').trim(),
          address: String(customer.address || 'Antananarivo').trim(),
          note: customer.note ? String(customer.note).trim() : undefined,
        },
        items: items.map((item: any) => ({
          productId: item.productId,
          reference: item.reference || item.productId,
          name: item.name || 'Produit D SECURE',
          quantity: Number(item.quantity) || 1,
          unitPriceAr: Number(item.unitPriceAr) || 0,
          totalPriceAr:
            Number(item.totalPriceAr) ||
            (Number(item.unitPriceAr) || 0) * (Number(item.quantity) || 1),
          image: item.image || null,
        })),
        totalAmountAr: Number(totalAmountAr) || 0,
        formattedTotal: `${new Intl.NumberFormat('fr-FR').format(Number(totalAmountAr) || 0)} Ar`,
        status: 'Nouvelle commande',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      orders.unshift(newOrder);
      await saveOrders(orders);

      await logAudit(
        'ORDER_CREATED',
        newOrder.id,
        newOrder.orderNumber,
        `Nouvelle commande de ${newOrder.customer.fullName} (${newOrder.formattedTotal})`,
        'Système Web Public'
      );

      res.status(201).json({
        success: true,
        order: newOrder,
      });
    })
  );

  app.post(
    '/api/analytics/track',
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const { page, productId, category } = req.body || {};
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = today.slice(0, 7);

        const ip = getClientIp(req);
        const ua = req.headers['user-agent'] || '';
        const anonVisitorHash = crypto
          .createHmac('sha256', tokenSecret)
          .update(`${today}:${ip}:${ua}`)
          .digest('hex')
          .slice(0, 16);

        const analytics = await getAnalytics();

        if (analytics.lastDate !== today) {
          analytics.lastDate = today;
          analytics.todayVisits = 0;
          analytics.visitorHashes = [];
          analytics.dailyVisits.push({ date: today, visits: 0 });
          if (analytics.dailyVisits.length > 30) analytics.dailyVisits.shift();
        }

        if (!Array.isArray(analytics.visitorHashes)) analytics.visitorHashes = [];
        if (!analytics.visitorHashes.includes(anonVisitorHash)) {
          analytics.visitorHashes.push(anonVisitorHash);
          analytics.uniqueVisitorsCount = (analytics.uniqueVisitorsCount || 0) + 1;
        }

        analytics.totalVisits += 1;
        analytics.todayVisits += 1;
        analytics.lastVisitedAt = new Date().toISOString();

        const lastDay = analytics.dailyVisits[analytics.dailyVisits.length - 1];
        if (lastDay && lastDay.date === today) {
          lastDay.visits += 1;
        } else {
          analytics.dailyVisits.push({ date: today, visits: 1 });
        }

        if (!Array.isArray(analytics.monthlyVisits)) analytics.monthlyVisits = [];
        const monthEntry = analytics.monthlyVisits.find((m) => m.month === currentMonth);
        if (monthEntry) {
          monthEntry.visits += 1;
        } else {
          analytics.monthlyVisits.push({ month: currentMonth, visits: 1 });
          if (analytics.monthlyVisits.length > 12) analytics.monthlyVisits.shift();
        }

        if (page && typeof page === 'string' && page !== '/admin') {
          analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
        }
        if (category && typeof category === 'string') {
          if (!analytics.categoryViews) analytics.categoryViews = {};
          analytics.categoryViews[category] = (analytics.categoryViews[category] || 0) + 1;
        }
        if (productId && typeof productId === 'string') {
          analytics.productViews[productId] = (analytics.productViews[productId] || 0) + 1;
        }

        await saveAnalytics(analytics);
        res.json({ success: true });
      } catch {
        res.status(200).json({ success: false });
      }
    })
  );

  app.get(
    '/api/health',
    asyncHandler(async (_req: Request, res: Response) => {
      const [products, packs, orders] = await Promise.all([
        getProducts(),
        getPacks(),
        getOrders(),
      ]);
      const info = storage.getInfo();
      res.json({
        status: 'ok',
        brand: 'D SECURE Madagascar',
        runtime: info.runtime,
        storageMode: info.mode,
        storagePersistent: info.persistent,
        publicCatalogCount: products.length,
        activePacksCount: packs.filter((p) => p.isActive !== false).length,
        activeOrdersCount: orders.length,
      });
    })
  );

  // ==========================================
  // 2. PROTECTED ADMIN API ROUTES
  // ==========================================

  app.post(
    '/api/admin/login',
    asyncHandler(async (req: Request, res: Response) => {
      const ip = getClientIp(req);
      const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);
      const attemptKey = `ratelimit_${ipHash}`;
      const now = Date.now();

      const attempt = await storage.getJSONWithTTL<LoginAttemptInfo>(attemptKey);
      if (attempt && attempt.lockedUntil > now) {
        const remainingMins = Math.ceil((attempt.lockedUntil - now) / 60000);
        res.status(429).json({
          success: false,
          error: `Accès temporairement bloqué suite à 5 tentatives infructueuses. Réessayez dans ${remainingMins} minute(s).`,
          locked: true,
          remainingMinutes: remainingMins,
        });
        return;
      }

      const { password } = req.body || {};
      if (!password || typeof password !== 'string') {
        res.status(400).json({ success: false, error: 'Mot de passe requis.' });
        return;
      }

      const isMatch = await verifyAdminPassword(password);

      if (!isMatch) {
        const currentAttempt: LoginAttemptInfo = attempt || {
          count: 0,
          lastAttempt: now,
          lockedUntil: 0,
        };
        currentAttempt.count += 1;
        currentAttempt.lastAttempt = now;

        if (currentAttempt.count >= 5) {
          currentAttempt.lockedUntil = now + 15 * 60 * 1000;
          await storage.setJSONWithTTL(attemptKey, currentAttempt, 15 * 60);
          res.status(429).json({
            success: false,
            error:
              'Trop de tentatives incorrectes. Votre accès est temporairement suspendu pendant 15 minutes.',
            locked: true,
          });
          return;
        }

        await storage.setJSONWithTTL(attemptKey, currentAttempt, 15 * 60);
        const attemptsLeft = 5 - currentAttempt.count;
        res.status(401).json({
          success: false,
          error: `Mot de passe administrateur incorrect. (${attemptsLeft} tentative(s) restante(s))`,
          attemptsLeft,
        });
        return;
      }

      await storage.deleteKey(attemptKey);

      const jti = crypto.randomBytes(16).toString('hex');
      const token = signSessionToken(jti, now);
      await storage.setJSONWithTTL(
        `session_${jti}`,
        { lastActiveAt: now },
        Math.ceil(SESSION_INACTIVITY_TIMEOUT_MS / 1000)
      );

      await logAudit(
        'ADMIN_LOGIN',
        'admin',
        'Direction D SECURE',
        'Ouverture de session administrateur sécurisée'
      );

      res.json({
        success: true,
        token,
        expiresInSeconds: Math.floor(SESSION_INACTIVITY_TIMEOUT_MS / 1000),
        user: {
          role: 'administrator',
          name: 'Direction D SECURE',
          sessionTimeoutMinutes: 30,
        },
        storageInfo: storage.getInfo(),
      });
    })
  );

  app.post(
    '/api/admin/logout',
    asyncHandler(async (req: Request, res: Response) => {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
      if (token) {
        const payload = verifySignedToken(token);
        if (payload) {
          await storage.setJSONWithTTL(`revoked_${payload.jti}`, { revokedAt: Date.now() }, 8 * 3600);
          await storage.deleteKey(`session_${payload.jti}`);
        }
      }
      res.json({ success: true, message: 'Déconnexion réussie.' });
    })
  );

  app.get('/api/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({
      authenticated: true,
      role: 'administrator',
      serverTime: new Date().toISOString(),
      storageInfo: storage.getInfo(),
    });
  });

  app.get(
    '/api/admin/dashboard-stats',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const [masterProducts, categories, packs, orders, analytics, auditLogs] = await Promise.all([
        getProducts(),
        getCategories(),
        getPacks(),
        getOrders(),
        getAnalytics(),
        getAuditLogs(),
      ]);

      let totalPurchaseValueAr = 0;
      let totalSellingValueAr = 0;
      let withPriceCount = 0;
      let missingPriceCount = 0;
      let withImageCount = 0;
      let flaggedCount = 0;
      let availableCount = 0;
      let unavailableCount = 0;
      const sheetDistribution: { [key: string]: number } = {};

      masterProducts.forEach((p) => {
        const sheet = p.sourceSheet || 'Catalogue';
        sheetDistribution[sheet] = (sheetDistribution[sheet] || 0) + 1;

        if (p.image) withImageCount++;
        if (p.issue) flaggedCount++;
        if (p.isAvailable !== false) availableCount++;
        else unavailableCount++;

        if (typeof p.originalPriceAr === 'number' && p.originalPriceAr > 0) {
          withPriceCount++;
          totalPurchaseValueAr += p.originalPriceAr;
          if (typeof p.sellingPriceAr === 'number') {
            totalSellingValueAr += p.sellingPriceAr;
          }
        } else {
          missingPriceCount++;
        }
      });

      const grossMarginAr = totalSellingValueAr - totalPurchaseValueAr;
      const averageMarginPercent =
        totalPurchaseValueAr > 0 ? Math.round((grossMarginAr / totalPurchaseValueAr) * 100) : 0;

      const ordersCount = orders.length;
      const pendingOrdersCount = orders.filter(
        (o) =>
          o.status === 'Nouvelle commande' ||
          o.status === 'En attente de confirmation' ||
          o.status === 'En préparation'
      ).length;
      const completedOrdersCount = orders.filter(
        (o) => o.status === 'Confirmée' || o.status === 'Livrée'
      ).length;

      const customerPhones = new Set<string>();
      orders.forEach((o) => {
        if (o.customer?.phone) customerPhones.add(o.customer.phone);
      });

      res.json({
        success: true,
        storageInfo: storage.getInfo(),
        summary: {
          totalCount: masterProducts.length,
          availableCount,
          unavailableCount,
          withImageCount,
          withoutImageCount: masterProducts.length - withImageCount,
          withPriceCount,
          missingPriceCount,
          flaggedCount,
          totalPurchaseValueAr,
          totalSellingValueAr,
          grossMarginAr,
          averageMarginPercent,
          sheetDistribution,
          categoriesCount: categories.length,
          activeCategoriesCount: categories.filter((c) => c.isActive !== false).length,
          packsCount: packs.length,
          activePacksCount: packs.filter((p) => p.isActive !== false).length,
          ordersCount,
          pendingOrdersCount,
          completedOrdersCount,
          customersCount: customerPhones.size,
          totalVisits: analytics.totalVisits,
          uniqueVisitorsCount: analytics.uniqueVisitorsCount || 0,
        },
        recentActivity: auditLogs.slice(0, 12),
      });
    })
  );

  app.get(
    '/api/admin/products',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const masterProducts = await getProducts();
      const enriched = masterProducts.map((p) => {
        let marginAr: number | null = null;
        let marginPercentage: number | null = null;

        if (
          typeof p.originalPriceAr === 'number' &&
          typeof p.sellingPriceAr === 'number' &&
          p.originalPriceAr > 0
        ) {
          marginAr = p.sellingPriceAr - p.originalPriceAr;
          marginPercentage = Math.round((marginAr / p.originalPriceAr) * 100);
        }

        return {
          ...p,
          isAvailable: p.isAvailable !== false,
          marginAr,
          marginPercentage,
        };
      });

      res.json({
        success: true,
        count: enriched.length,
        products: enriched,
      });
    })
  );

  app.post(
    '/api/admin/products',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const {
        name,
        reference,
        description,
        category,
        topSection,
        sellingPriceAr,
        originalPriceAr,
        image,
        isAvailable,
        displayOrder,
      } = req.body || {};

      if (!name || !reference) {
        res.status(400).json({ error: 'Le nom et la référence exacte sont obligatoires.' });
        return;
      }

      const masterProducts = await getProducts();
      const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const parsedSelling =
        sellingPriceAr !== undefined && sellingPriceAr !== null && sellingPriceAr !== ''
          ? Number(sellingPriceAr)
          : null;
      const parsedOriginal =
        originalPriceAr !== undefined && originalPriceAr !== null && originalPriceAr !== ''
          ? Number(originalPriceAr)
          : null;

      const newProduct = {
        id,
        name: String(name).trim(),
        reference: String(reference).trim(),
        description: description ? String(description).trim() : '',
        category: category ? String(category).trim() : 'Caméras de Surveillance',
        topSection: topSection || 'cameras',
        sellingPriceAr: parsedSelling,
        originalPriceAr: parsedOriginal,
        formattedPrice: parsedSelling
          ? `${new Intl.NumberFormat('fr-FR').format(parsedSelling)} Ar`
          : 'Prix sur demande',
        currency: 'Ar',
        image: image || null,
        images: image ? [image] : [],
        isAvailable: isAvailable !== false,
        displayOrder:
          displayOrder !== undefined && displayOrder !== '' ? Number(displayOrder) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      masterProducts.unshift(newProduct);
      await saveProducts(masterProducts);

      await logAudit(
        'PRODUCT_CREATED',
        newProduct.id,
        newProduct.reference,
        `Ajout du matériel ${newProduct.name} (${newProduct.formattedPrice})`
      );

      res.status(201).json({
        success: true,
        product: newProduct,
      });
    })
  );

  app.put(
    '/api/admin/products/:id',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const masterProducts = await getProducts();
      const index = masterProducts.findIndex((p) => p.id === id);

      if (index === -1) {
        res.status(404).json({ error: 'Produit non trouvé.' });
        return;
      }

      const current = masterProducts[index];
      const {
        name,
        reference,
        description,
        category,
        topSection,
        sellingPriceAr,
        originalPriceAr,
        image,
        isAvailable,
        displayOrder,
      } = req.body || {};

      const parsedSelling =
        sellingPriceAr !== undefined
          ? sellingPriceAr === null || sellingPriceAr === ''
            ? null
            : Number(sellingPriceAr)
          : current.sellingPriceAr;

      const parsedOriginal =
        originalPriceAr !== undefined
          ? originalPriceAr === null || originalPriceAr === ''
            ? null
            : Number(originalPriceAr)
          : current.originalPriceAr;

      const updated = {
        ...current,
        name: name !== undefined ? String(name).trim() : current.name,
        reference: reference !== undefined ? String(reference).trim() : current.reference,
        description: description !== undefined ? String(description).trim() : current.description,
        category: category !== undefined ? String(category).trim() : current.category,
        topSection: topSection !== undefined ? topSection : current.topSection,
        sellingPriceAr: parsedSelling,
        originalPriceAr: parsedOriginal,
        formattedPrice: parsedSelling
          ? `${new Intl.NumberFormat('fr-FR').format(parsedSelling)} Ar`
          : 'Prix sur demande',
        image: image !== undefined ? image : current.image,
        images: image !== undefined ? (image ? [image] : []) : current.images,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : current.isAvailable !== false,
        displayOrder:
          displayOrder !== undefined
            ? displayOrder === '' || displayOrder === null
              ? undefined
              : Number(displayOrder)
            : current.displayOrder,
        updatedAt: new Date().toISOString(),
      };

      const changes: string[] = [];
      if (updated.sellingPriceAr !== current.sellingPriceAr) {
        changes.push(`Prix: ${current.formattedPrice} -> ${updated.formattedPrice}`);
      }
      if (updated.reference !== current.reference) {
        changes.push(`Réf: ${current.reference} -> ${updated.reference}`);
      }
      if (updated.image !== current.image) {
        changes.push('Image modifiée');
      }
      if (updated.category !== current.category || updated.topSection !== current.topSection) {
        changes.push(`Catégorie: ${current.category} -> ${updated.category}`);
      }
      if (updated.isAvailable !== (current.isAvailable !== false)) {
        changes.push(`Statut: ${updated.isAvailable ? 'DISPONIBLE' : 'INDISPONIBLE'}`);
      }
      if (updated.displayOrder !== current.displayOrder) {
        changes.push(`Ordre: ${updated.displayOrder ?? 'auto'}`);
      }

      masterProducts[index] = updated;
      await saveProducts(masterProducts);

      if (updated.sellingPriceAr !== current.sellingPriceAr) {
        await recalculateAllPacks(masterProducts);
        await logAudit(
          'PRICE_MODIFIED',
          updated.id,
          updated.reference,
          `${changes.join(' | ')} (Packs synchronisés)`
        );
      } else {
        await logAudit(
          updated.reference !== current.reference
            ? 'REFERENCE_MODIFIED'
            : updated.image !== current.image
              ? 'IMAGE_MODIFIED'
              : 'PRODUCT_UPDATED',
          updated.id,
          updated.reference,
          changes.length > 0 ? changes.join(' | ') : `Mise à jour fiche ${updated.name}`
        );
      }

      res.json({
        success: true,
        product: updated,
      });
    })
  );

  app.patch(
    '/api/admin/products/:id/availability',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const masterProducts = await getProducts();
      const index = masterProducts.findIndex((p) => p.id === id);

      if (index === -1) {
        res.status(404).json({ error: 'Produit non trouvé.' });
        return;
      }

      const { isAvailable } = req.body || {};
      const newStatus =
        typeof isAvailable === 'boolean'
          ? isAvailable
          : !(masterProducts[index].isAvailable !== false);

      masterProducts[index].isAvailable = newStatus;
      masterProducts[index].updatedAt = new Date().toISOString();

      await saveProducts(masterProducts);

      await logAudit(
        'AVAILABILITY_TOGGLED',
        masterProducts[index].id,
        masterProducts[index].reference,
        `Disponibilité modifiée : ${newStatus ? 'DISPONIBLE' : 'INDISPONIBLE'}`
      );

      res.json({
        success: true,
        id,
        isAvailable: newStatus,
      });
    })
  );

  app.delete(
    '/api/admin/products/:id',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const masterProducts = await getProducts();
      const index = masterProducts.findIndex((p) => p.id === id);

      if (index === -1) {
        res.status(404).json({ error: 'Produit non trouvé.' });
        return;
      }

      const target = masterProducts[index];
      await createBackupSnapshot(`Avant suppression produit ${target.reference}`);

      const deleted = masterProducts.splice(index, 1)[0];
      await saveProducts(masterProducts);

      await logAudit(
        'PRODUCT_DELETED',
        deleted.id,
        deleted.reference,
        `Suppression définitive du matériel ${deleted.name}`
      );

      res.json({
        success: true,
        deletedId: id,
        message: `Matériel ${deleted.reference} supprimé avec succès (sauvegarde effectuée).`,
      });
    })
  );

  // -------------------------------------------------------------
  // IMAGE UPLOAD & PICKER
  // -------------------------------------------------------------
  app.post(
    '/api/admin/upload-image',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { filename, mimeType, dataBase64 } = req.body || {};

      if (!dataBase64 || typeof dataBase64 !== 'string') {
        res.status(400).json({ error: 'Aucune donnée image reçue.' });
        return;
      }

      const allowedMimes: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
      };

      const ext = allowedMimes[(mimeType || '').toLowerCase()];
      if (!ext) {
        res.status(400).json({ error: 'Format non autorisé. Utilisez uniquement JPG, PNG ou WEBP.' });
        return;
      }

      const rawBase64 = dataBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      const buffer = Buffer.from(rawBase64, 'base64');

      if (buffer.length === 0 || buffer.length > 3.5 * 1024 * 1024) {
        res.status(400).json({ error: 'Taille de fichier invalide (max 3.5 Mo).' });
        return;
      }

      const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng =
        buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
      const isWebp =
        buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
        buffer.slice(8, 12).toString('ascii') === 'WEBP';

      if (!isJpeg && !isPng && !isWebp) {
        res
          .status(400)
          .json({ error: 'Le contenu binaire du fichier ne correspond pas à une image valide.' });
        return;
      }

      const safeBase = (filename || 'produit')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .slice(0, 40);
      const uniqueName = `${safeBase}-${Date.now()}${ext}`;

      const webPath = await storage.saveUploadedImage(uniqueName, mimeType, buffer);

      await logAudit(
        'IMAGE_UPLOADED',
        uniqueName,
        uniqueName,
        `Nouvelle image importée (${(buffer.length / 1024).toFixed(1)} KB) -> ${webPath}`
      );

      res.status(201).json({
        success: true,
        imagePath: webPath,
        filename: uniqueName,
      });
    })
  );

  app.get(
    '/api/admin/available-images',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const masterProducts = await getProducts();
      const usageMap: Record<string, string[]> = {};
      masterProducts.forEach((p) => {
        if (p.image) {
          if (!usageMap[p.image]) usageMap[p.image] = [];
          usageMap[p.image].push(p.reference);
        }
      });

      const images = await storage.listAvailableImages(usageMap);
      res.json({
        success: true,
        count: images.length,
        images,
      });
    })
  );

  // -------------------------------------------------------------
  // CATEGORIES MANAGEMENT
  // -------------------------------------------------------------
  app.get(
    '/api/admin/categories',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const [categories, masterProducts] = await Promise.all([getCategories(), getProducts()]);
      const enrichedCategories = [...categories]
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map((cat) => {
          const count = masterProducts.filter(
            (p) => p.topSection === cat.topSection || p.category === cat.name
          ).length;
          return {
            ...cat,
            productCount: count,
          };
        });

      res.json({
        success: true,
        categories: enrichedCategories,
      });
    })
  );

  app.post(
    '/api/admin/categories',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { name, topSection, description, image, order, isActive } = req.body || {};
      if (!name) {
        res.status(400).json({ error: 'Le nom de la catégorie est obligatoire.' });
        return;
      }

      const categories = await getCategories();
      const newCat = {
        id: `cat-${Date.now()}`,
        name: String(name).trim(),
        topSection: topSection || 'accessories',
        description: description ? String(description).trim() : '',
        image: image || null,
        isActive: isActive !== false,
        order: Number(order) || categories.length + 1,
      };

      categories.push(newCat);
      await saveCategories(categories);

      await logAudit(
        'CATEGORY_MODIFIED',
        newCat.id,
        newCat.name,
        `Création de la catégorie ${newCat.name} (section ${newCat.topSection})`
      );

      res.status(201).json({ success: true, category: newCat });
    })
  );

  app.put(
    '/api/admin/categories/:id',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const categories = await getCategories();
      const index = categories.findIndex((c) => c.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Catégorie non trouvée.' });
        return;
      }

      const oldName = categories[index].name;
      const { name, topSection, description, image, isActive, order, renameProductsCategory } =
        req.body || {};

      categories[index] = {
        ...categories[index],
        name: name !== undefined ? String(name).trim() : categories[index].name,
        topSection: topSection !== undefined ? topSection : categories[index].topSection,
        description:
          description !== undefined ? String(description).trim() : categories[index].description,
        image: image !== undefined ? image : categories[index].image,
        isActive: isActive !== undefined ? Boolean(isActive) : categories[index].isActive,
        order: order !== undefined ? Number(order) : categories[index].order,
      };

      if (renameProductsCategory && name && name.trim() !== oldName) {
        const masterProducts = await getProducts();
        masterProducts.forEach((p) => {
          if (p.category === oldName) {
            p.category = name.trim();
          }
        });
        await saveProducts(masterProducts);
      }

      await saveCategories(categories);
      await logAudit(
        'CATEGORY_MODIFIED',
        id,
        categories[index].name,
        `Mise à jour de la catégorie ${categories[index].name} (Active: ${
          categories[index].isActive ? 'OUI' : 'NON'
        }, Position: ${categories[index].order})`
      );

      res.json({ success: true, category: categories[index] });
    })
  );

  app.post(
    '/api/admin/categories/:id/assign-products',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { productIds } = req.body || {};
      const categories = await getCategories();
      const cat = categories.find((c) => c.id === id);
      if (!cat) {
        res.status(404).json({ error: 'Catégorie non trouvée.' });
        return;
      }
      if (!Array.isArray(productIds) || productIds.length === 0) {
        res.status(400).json({ error: 'Aucun matériel sélectionné.' });
        return;
      }

      const masterProducts = await getProducts();
      let updatedCount = 0;
      masterProducts.forEach((p) => {
        if (productIds.includes(p.id)) {
          p.category = cat.name;
          p.topSection = cat.topSection;
          p.updatedAt = new Date().toISOString();
          updatedCount++;
        }
      });

      await saveProducts(masterProducts);
      await logAudit(
        'CATEGORY_MODIFIED',
        id,
        cat.name,
        `${updatedCount} matériel(s) associé(s) à ${cat.name}`
      );
      res.json({ success: true, updatedCount });
    })
  );

  // -------------------------------------------------------------
  // PACKS MANAGEMENT
  // -------------------------------------------------------------
  app.get(
    '/api/admin/packs',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const packs = await getPacks();
      res.json({
        success: true,
        count: packs.length,
        packs,
      });
    })
  );

  app.post(
    '/api/admin/packs',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const payload = req.body;
      if (!payload || !payload.name) {
        res.status(400).json({ error: 'Le nom du pack est obligatoire.' });
        return;
      }

      const sepError = validatePackTechnologySeparation(payload);
      if (sepError) {
        res.status(400).json({ error: sepError });
        return;
      }

      const [masterProducts, packs] = await Promise.all([getProducts(), getPacks()]);
      const newPack = computePackTotals(
        masterProducts,
        {
          ...payload,
          id: payload.id || `pack-${payload.family || 'custom'}-${Date.now()}`,
          isActive: payload.isActive !== false,
          installationIncluded: payload.installationIncluded !== false,
        },
        Boolean(payload.syncFromCatalog)
      );

      packs.push(newPack);
      await savePacks(packs);
      await logAudit(
        'PACK_CREATED',
        newPack.id,
        newPack.name,
        `Création du pack ${newPack.name} (${newPack.formattedPrice})`
      );

      res.status(201).json({ success: true, pack: newPack });
    })
  );

  app.put(
    '/api/admin/packs/:id',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const [masterProducts, packs] = await Promise.all([getProducts(), getPacks()]);
      const index = packs.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Pack non trouvé.' });
        return;
      }

      const merged = { ...packs[index], ...req.body };
      const sepError = validatePackTechnologySeparation(merged);
      if (sepError) {
        res.status(400).json({ error: sepError });
        return;
      }

      const updated = computePackTotals(masterProducts, merged, Boolean(req.body?.syncFromCatalog));
      packs[index] = updated;
      await savePacks(packs);

      await logAudit(
        'PACK_MODIFIED',
        updated.id,
        updated.name,
        `Pack modifié : ${updated.name} -> Total ${updated.formattedPrice} (Actif: ${
          updated.isActive ? 'OUI' : 'NON'
        })`
      );

      res.json({ success: true, pack: updated });
    })
  );

  app.patch(
    '/api/admin/packs/:id/toggle',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const packs = await getPacks();
      const index = packs.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Pack non trouvé.' });
        return;
      }

      const nextActive =
        typeof req.body?.isActive === 'boolean'
          ? req.body.isActive
          : !(packs[index].isActive !== false);
      packs[index].isActive = nextActive;
      packs[index].updatedAt = new Date().toISOString();
      await savePacks(packs);

      await logAudit(
        'PACK_MODIFIED',
        id,
        packs[index].name,
        `Pack ${nextActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'} sur le site public`
      );
      res.json({ success: true, id, isActive: nextActive });
    })
  );

  app.post(
    '/api/admin/packs/recalculate-all',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const masterProducts = await getProducts();
      const updated = await recalculateAllPacks(masterProducts);
      await logAudit(
        'PACK_MODIFIED',
        'all-packs',
        'Tous les packs',
        'Recalcul automatique des prix de tous les packs selon le catalogue actuel'
      );
      res.json({ success: true, packs: updated });
    })
  );

  app.delete(
    '/api/admin/packs/:id',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const packs = await getPacks();
      const index = packs.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Pack non trouvé.' });
        return;
      }

      await createBackupSnapshot(`Avant suppression pack ${packs[index].name}`);
      const deleted = packs.splice(index, 1)[0];
      await savePacks(packs);
      await logAudit('PACK_DELETED', id, deleted.name, `Suppression du pack ${deleted.name}`);
      res.json({ success: true, deletedId: id });
    })
  );

  // -------------------------------------------------------------
  // ORDERS & CUSTOMERS
  // -------------------------------------------------------------
  app.get(
    '/api/admin/orders',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const orders = await getOrders();
      const statusFilter = req.query.status as string;
      let result = orders;
      if (statusFilter && statusFilter !== 'all') {
        result = orders.filter((o) => o.status === statusFilter);
      }
      res.json({ success: true, count: result.length, orders: result });
    })
  );

  app.patch(
    '/api/admin/orders/:id/status',
    requireAdminAuth,
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const orders = await getOrders();
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) {
        res.status(404).json({ error: 'Commande non trouvée.' });
        return;
      }

      const { status, internalNotes } = req.body || {};
      const oldStatus = orders[index].status;
      orders[index].status = status || oldStatus;
      if (internalNotes !== undefined) {
        orders[index].internalNotes = internalNotes;
      }
      orders[index].updatedAt = new Date().toISOString();

      await saveOrders(orders);

      await logAudit(
        'ORDER_STATUS_CHANGED',
        id,
        orders[index].orderNumber,
        `Statut commande ${orders[index].orderNumber} changé : ${oldStatus} -> ${orders[index].status}`
      );

      res.json({ success: true, order: orders[index] });
    })
  );

  app.get(
    '/api/admin/customers',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const orders = await getOrders();
      const customerMap = new Map<string, any>();

      orders.forEach((o) => {
        const key = o.customer?.phone || o.customer?.fullName || 'inconnu';
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: `cust-${key.replace(/[^a-zA-Z0-9]/g, '') || 'anon'}`,
            fullName: o.customer?.fullName || 'Client sans nom',
            phone: o.customer?.phone || 'Non renseigné',
            whatsapp: o.customer?.phone || 'Non renseigné',
            address: o.customer?.address || 'Antananarivo',
            totalOrders: 0,
            totalSpentAr: 0,
            formattedTotalSpent: '0 Ar',
            firstOrderAt: o.createdAt,
            lastOrderAt: o.createdAt,
            orderIds: [],
            orders: [],
          });
        }

        const c = customerMap.get(key);
        c.totalOrders += 1;
        c.totalSpentAr += o.totalAmountAr || 0;
        c.orderIds.push(o.orderNumber || o.id);
        c.orders.push(o);
        if (new Date(o.createdAt) < new Date(c.firstOrderAt)) c.firstOrderAt = o.createdAt;
        if (new Date(o.createdAt) > new Date(c.lastOrderAt)) c.lastOrderAt = o.createdAt;
      });

      const customerList = Array.from(customerMap.values()).map((c) => ({
        ...c,
        formattedTotalSpent: `${new Intl.NumberFormat('fr-FR').format(c.totalSpentAr)} Ar`,
      }));

      res.json({ success: true, count: customerList.length, customers: customerList });
    })
  );

  // -------------------------------------------------------------
  // ANALYTICS, AUDIT LOGS & BACKUPS
  // -------------------------------------------------------------
  app.get(
    '/api/admin/analytics',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const [analytics, masterProducts] = await Promise.all([getAnalytics(), getProducts()]);
      const topProducts = Object.entries(analytics.productViews || {})
        .map(([prodId, views]) => {
          const prod = masterProducts.find((p) => p.id === prodId);
          return {
            productId: prodId,
            reference: prod?.reference || prodId,
            name: prod?.name || 'Produit catalogue',
            category: prod?.category || '',
            views,
          };
        })
        .sort((a, b) => b.views - a.views)
        .slice(0, 15);

      res.json({
        success: true,
        analytics: {
          totalVisits: analytics.totalVisits,
          todayVisits: analytics.todayVisits,
          uniqueVisitorsCount: analytics.uniqueVisitorsCount || 0,
          lastDate: analytics.lastDate,
          pageViews: analytics.pageViews || {},
          categoryViews: analytics.categoryViews || {},
          productViews: analytics.productViews || {},
          dailyVisits: analytics.dailyVisits || [],
          monthlyVisits: analytics.monthlyVisits || [],
          lastVisitedAt: analytics.lastVisitedAt,
          topProducts,
        },
      });
    })
  );

  app.get(
    '/api/admin/audit-logs',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const auditLogs = await getAuditLogs();
      res.json({
        success: true,
        count: auditLogs.length,
        logs: auditLogs,
      });
    })
  );

  app.post(
    '/api/admin/backups',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const filename = await createBackupSnapshot('Sauvegarde manuelle administrateur');
      await logAudit(
        'BACKUP_CREATED',
        filename,
        filename,
        `Sauvegarde complète créée sur le serveur (${filename})`
      );
      res.status(201).json({ success: true, filename });
    })
  );

  app.get(
    '/api/admin/backups',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const backups = await storage.listBackups();
      res.json({ success: true, backups });
    })
  );

  app.get(
    '/api/admin/export-database',
    requireAdminAuth,
    asyncHandler(async (_req: Request, res: Response) => {
      const [masterProducts, packs, orders, categories, analytics, auditLogs] = await Promise.all([
        getProducts(),
        getPacks(),
        getOrders(),
        getCategories(),
        getAnalytics(),
        getAuditLogs(),
      ]);

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        system: 'D SECURE Administrative Backup',
        version: '2026.2',
        productsCount: masterProducts.length,
        packsCount: packs.length,
        ordersCount: orders.length,
        products: masterProducts,
        packs,
        orders,
        categories,
        analytics: {
          totalVisits: analytics.totalVisits,
          todayVisits: analytics.todayVisits,
          uniqueVisitorsCount: analytics.uniqueVisitorsCount,
          pageViews: analytics.pageViews,
          categoryViews: analytics.categoryViews,
          productViews: analytics.productViews,
          dailyVisits: analytics.dailyVisits,
          monthlyVisits: analytics.monthlyVisits,
        },
        auditLogs,
      };

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="D_SECURE_BACKUP_${Date.now()}.json"`
      );
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(exportPayload, null, 2));
    })
  );

  app.get('/api/admin/files', requireAdminAuth, (_req: Request, res: Response) => {
    try {
      const files = storage.getInternalFiles();
      res.json({ success: true, files });
    } catch (err: any) {
      res.status(500).json({ error: 'Erreur lecture fichiers internes', details: err.message });
    }
  });

  app.get('/api/admin/files/:filename', requireAdminAuth, (req: Request, res: Response) => {
    const filename = path.basename(req.params.filename);
    const fullPath = storage.resolveInternalFile(filename);
    if (!fullPath) {
      res.status(404).json({ error: 'Fichier non trouvé.' });
      return;
    }
    res.download(fullPath, filename);
  });

  // Return clean JSON error for unknown /api routes instead of HTML fallback
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: 'Route API introuvable.' });
  });

  // Global JSON error handler for Express routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API error:', err);
    if (res.headersSent) return;
    res.status(err?.status || 500).json({
      success: false,
      error: err?.message || 'Erreur interne du serveur.',
    });
  });

  return app;
}
