import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Token HMAC secret (use env var in production)
const TOKEN_SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update('dsecure-mg-secret-key-2026').digest('hex');

app.use(express.json({ limit: '12mb' }));

// Security middleware: explicitly block any direct static access to sensitive extensions or server internals
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

// Paths to persistent data storage
const DATA_DIR = path.resolve(__dirname, 'server', 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'images', 'uploads');

[DATA_DIR, BACKUPS_DIR, UPLOADS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const MASTER_PRODUCTS_PATH = path.join(DATA_DIR, 'master-products.json');
const PUBLIC_PRODUCTS_PATH = path.resolve(__dirname, 'src', 'data', 'products.json');
const PACKS_PATH = path.join(DATA_DIR, 'packs.json');
const ORDERS_PATH = path.join(DATA_DIR, 'orders.json');
const ANALYTICS_PATH = path.join(DATA_DIR, 'analytics.json');
const AUDIT_LOGS_PATH = path.join(DATA_DIR, 'audit-logs.json');
const CATEGORIES_PATH = path.join(DATA_DIR, 'categories.json');
const SESSIONS_PATH = path.join(DATA_DIR, 'sessions.json');
const AUTH_CONFIG_PATH = path.join(DATA_DIR, '.admin-auth.json');
const INTERNAL_DOCS_DIR = path.join(DATA_DIR, 'internal');

// Generic JSON helpers
function loadJSON<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error loading JSON file ${filePath}:`, err);
  }
  return fallback;
}

function saveJSON(filePath: string, data: any): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error saving JSON file ${filePath}:`, err);
    return false;
  }
}

// -------------------------------------------------------------
// SECURE PASSWORD HASHING (Scrypt + Salted Storage)
// -------------------------------------------------------------
interface AdminAuthStore {
  salt: string;
  passwordHash: string;
  updatedAt: string;
}

function hashPasswordScrypt(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function initAdminAuth(): AdminAuthStore {
  const initialPassword = process.env.ADMIN_PASSWORD || 'JESS2026';
  const existing = loadJSON<AdminAuthStore | null>(AUTH_CONFIG_PATH, null);

  if (existing && existing.salt && existing.passwordHash) {
    // If env var explicitly overrides, check if it matches, otherwise keep existing store
    if (!process.env.ADMIN_PASSWORD) {
      return existing;
    }
    const envCheck = hashPasswordScrypt(process.env.ADMIN_PASSWORD, existing.salt);
    if (envCheck === existing.passwordHash) {
      return existing;
    }
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const store: AdminAuthStore = {
    salt,
    passwordHash: hashPasswordScrypt(initialPassword, salt),
    updatedAt: new Date().toISOString(),
  };
  saveJSON(AUTH_CONFIG_PATH, store);
  return store;
}

let adminAuthStore = initAdminAuth();

function verifyAdminPassword(candidate: string): boolean {
  try {
    const candidateHash = hashPasswordScrypt(candidate, adminAuthStore.salt);
    const bufA = Buffer.from(candidateHash, 'hex');
    const bufB = Buffer.from(adminAuthStore.passwordHash, 'hex');
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// IN-MEMORY DATA STORES (Backed by Disk JSON)
// -------------------------------------------------------------
let masterProducts: any[] = loadJSON<any[]>(MASTER_PRODUCTS_PATH, []);
let packs: any[] = loadJSON<any[]>(PACKS_PATH, []);
let orders: any[] = loadJSON<any[]>(ORDERS_PATH, []);
let auditLogs: any[] = loadJSON<any[]>(AUDIT_LOGS_PATH, []);
let categories: any[] = loadJSON<any[]>(CATEGORIES_PATH, []);

// Initial categories if empty
if (categories.length === 0) {
  categories = [
    { id: 'cat-cameras', name: 'Caméras de Surveillance', topSection: 'cameras', description: 'Caméras IP AcuSense, ColorVu, analogiques Turbo HD, PTZ motorisées et caméras solaires 4G', image: '/images/CAMERAS_IP/CAMERAS_IP__DS-2CD1023G2-LIU.jpg', isActive: true, order: 1 },
    { id: 'cat-alarms', name: "Systèmes d'Alarme", topSection: 'alarms', description: 'Protection sans fil et filaire AX PRO, PIRCAM, claviers et sirènes 110dB', image: '/images/ALARMES_SANS_FIL/ALARMES_SANS_FIL__DS-PWA64-Kit-WB-O-STD.jpg', isActive: true, order: 2 },
    { id: 'cat-packs', name: 'Kits & Packs Vidéosurveillance', topSection: 'packs', description: 'Solutions clés en main prêtes à installer avec caméras, enregistreur et pose offerte', image: '/images/packs/pack_ip_poe_4.jpg', isActive: true, order: 3 },
    { id: 'cat-dvr-nvr', name: 'Enregistreurs DVR & NVR', topSection: 'dvr_nvr', description: 'Enregistreurs numériques haute performance avec compression H.265+ et ports PoE', image: '/images/NVR/NVR__DS-7104NI-Q1-4P-M.jpg', isActive: true, order: 4 },
    { id: 'cat-accessories', name: 'Accessoires & Câblage', topSection: 'accessories', description: 'Câbles coaxiaux KX6, cordons RJ45, connecteurs BNC, boîtiers étanches et supports', image: '/images/ACCESSOIRES/ACCESSOIRES__DS-1280ZJ-XS.jpg', isActive: true, order: 5 },
    { id: 'cat-hdd', name: 'Disques Durs de Surveillance', topSection: 'hdd', description: 'Disques internes certifiés Seagate SkyHawk et WD Purple pour écriture 24/7', image: '/images/DISQUES_DURS/DISQUES_DURS__A_IDENTIFIER.png', isActive: true, order: 6 },
    { id: 'cat-network', name: 'Réseau & Switchs PoE', topSection: 'network', description: 'Switchs PoE industriels, routeurs 4G longue portée et ponts sans fil', image: '/images/SWITCH_POE/SWITCH_POE__DS-3E0505P-E-M.png', isActive: true, order: 7 },
    { id: 'cat-monitors', name: 'Moniteurs & Écrans', topSection: 'monitors', description: 'Écrans professionnels de vidéosurveillance Full HD et 4K', image: '/images/MONITEURS/MONITEURS__DS-D5024FN.jpg', isActive: true, order: 8 },
  ];
  saveJSON(CATEGORIES_PATH, categories);
}

// Analytics store (Zero fabricated initial stats)
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

const todayStr = new Date().toISOString().split('T')[0];
let analytics: AnalyticsStore = loadJSON<AnalyticsStore>(ANALYTICS_PATH, {
  totalVisits: 0,
  todayVisits: 0,
  uniqueVisitorsCount: 0,
  visitorHashes: [],
  lastDate: todayStr,
  pageViews: {},
  categoryViews: {},
  productViews: {},
  dailyVisits: [{ date: todayStr, visits: 0 }],
  monthlyVisits: [{ month: todayStr.slice(0, 7), visits: 0 }],
  lastVisitedAt: null,
});

function logAudit(action: string, entityId: string, entityName: string, details: string, user = 'Direction D SECURE') {
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    entityId,
    entityName,
    details,
    user,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 500) auditLogs.pop();
  saveJSON(AUDIT_LOGS_PATH, auditLogs);
}

function createServerBackup(reason: string): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${stamp}.json`;
  const payload = {
    createdAt: new Date().toISOString(),
    reason,
    productsCount: masterProducts.length,
    packsCount: packs.length,
    ordersCount: orders.length,
    products: masterProducts,
    packs,
    orders,
    categories,
  };
  saveJSON(path.join(BACKUPS_DIR, filename), payload);

  // Retain only last 25 backups
  try {
    const files = fs.readdirSync(BACKUPS_DIR).filter((f) => f.endsWith('.json')).sort();
    while (files.length > 25) {
      const oldest = files.shift();
      if (oldest) fs.unlinkSync(path.join(BACKUPS_DIR, oldest));
    }
  } catch {}
  return filename;
}

// Sync sanitized public products cache & file
function getSanitizedPublicProducts() {
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
        (p.sellingPriceAr ? `${new Intl.NumberFormat('fr-FR').format(p.sellingPriceAr)} Ar` : 'Prix sur demande'),
      currency: p.currency || 'Ar',
      image: p.image || null,
      images: p.images || (p.image ? [p.image] : []),
      topSection: p.topSection,
      isAvailable: p.isAvailable !== false,
      displayOrder: p.displayOrder,
      updatedAt: p.updatedAt || new Date().toISOString(),
    }));
}

function syncPublicProducts() {
  const publicProducts = getSanitizedPublicProducts();
  saveJSON(PUBLIC_PRODUCTS_PATH, publicProducts);
  return publicProducts;
}

// -------------------------------------------------------------
// PACK ENGINE: STRICT ANALOG/IP SEPARATION & CATALOG PRICE SYNC
// -------------------------------------------------------------
function normalizeRef(ref: string): string {
  return (ref || '')
    .toUpperCase()
    .replace(/\((O-STD|STD|C|EUR|F1|S7|T5)\)/g, '')
    .replace(/\([^)]*MM\)/gi, '')
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9\-\/]/g, '');
}

function findMatchingCatalogProduct(bomRef: string): any | undefined {
  if (!bomRef) return undefined;
  const exact = masterProducts.find(
    (p) => (p.reference || '').toUpperCase() === bomRef.toUpperCase()
  );
  if (exact) return exact;

  const normTarget = normalizeRef(bomRef);
  if (!normTarget || normTarget.length < 5) return undefined;

  return masterProducts.find((p) => {
    const normProd = normalizeRef(p.reference || '');
    return normProd === normTarget || normProd.startsWith(normTarget) || normTarget.startsWith(normProd);
  });
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
      if (text.includes('NVR') || text.includes('RJ45') || text.includes('CAT6') || text.includes('CAMÉRAS IP') || text.includes('DS-2CD')) {
        return `Incompatibilité technique détectée dans ce pack Analogique : le composant "${item.name}" (${item.ref}) appartient à la technologie IP Numérique.`;
      }
    } else if (family === 'ip') {
      if (text.includes('DVR') || text.includes('BNC') || text.includes('COAXIAL') || text.includes('TURBO HD') || text.includes('DS-2CE') || text.includes('DS-720')) {
        return `Incompatibilité technique détectée dans ce pack IP Numérique : le composant "${item.name}" (${item.ref}) appartient à la technologie Analogique.`;
      }
    }
  }
  return null;
}

function computePackTotals(pack: any, syncCatalogPrices = false): any {
  const updatedBom = (Array.isArray(pack.bom) ? pack.bom : []).map((item: any) => {
    let unitPriceAr = Number(item.unitPriceAr) || 0;
    if (syncCatalogPrices && !item.isOffered) {
      const catalogMatch = findMatchingCatalogProduct(item.ref);
      if (catalogMatch && typeof catalogMatch.sellingPriceAr === 'number' && catalogMatch.sellingPriceAr > 0) {
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

  const totalPriceAr = updatedBom.reduce((sum: number, item: any) => {
    if (item.isOffered) return sum;
    return sum + item.totalPriceAr;
  }, 0);

  return {
    ...pack,
    bom: updatedBom,
    totalPriceAr,
    formattedPrice: `${new Intl.NumberFormat('fr-FR').format(totalPriceAr)} Ar`,
    isActive: pack.isActive !== false,
    updatedAt: new Date().toISOString(),
  };
}

function recalculateAllPacksFromCatalog() {
  packs = packs.map((pk) => computePackTotals(pk, true));
  saveJSON(PACKS_PATH, packs);
}

// -------------------------------------------------------------
// SESSIONS & BRUTE-FORCE PROTECTION
// -------------------------------------------------------------
interface AdminSession {
  token: string;
  createdAt: number;
  lastActiveAt: number;
  ip: string;
}

const persistedSessions = loadJSON<Array<[string, AdminSession]>>(SESSIONS_PATH, []);
const activeSessions = new Map<string, AdminSession>(persistedSessions);
const SESSION_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function persistSessions() {
  // Prune expired sessions before writing
  const now = Date.now();
  for (const [t, s] of activeSessions.entries()) {
    if (now - s.lastActiveAt > SESSION_INACTIVITY_TIMEOUT_MS) {
      activeSessions.delete(t);
    }
  }
  saveJSON(SESSIONS_PATH, Array.from(activeSessions.entries()));
}

interface LoginAttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, LoginAttemptRecord>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function generateAdminToken(): string {
  const payload = `admin-${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
  const hash = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${hash}`;
}

function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, hash] = parts;
    const payload = Buffer.from(payloadB64, 'base64').toString('utf-8');
    const expectedHash = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
    const a = Buffer.from(hash);
    const b = Buffer.from(expectedHash);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({
      error: 'Accès non autorisé. Authentification administrateur requise.',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  const session = activeSessions.get(token);
  if (!session) {
    res.status(401).json({
      error: 'Session introuvable ou expirée. Veuillez vous reconnecter.',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  if (Date.now() - session.lastActiveAt > SESSION_INACTIVITY_TIMEOUT_MS) {
    activeSessions.delete(token);
    persistSessions();
    res.status(401).json({
      error: "Session expirée après 30 minutes d'inactivité pour des raisons de sécurité. Veuillez vous reconnecter.",
      code: 'SESSION_EXPIRED',
    });
    return;
  }

  session.lastActiveAt = Date.now();
  persistSessions();
  next();
}

// ==========================================
// 1. PUBLIC API ROUTES (Zero Confidential Data)
// ==========================================

app.get('/api/products', (_req: Request, res: Response) => {
  const publicList = getSanitizedPublicProducts();
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    success: true,
    count: publicList.length,
    products: publicList,
  });
});

app.get('/api/categories', (_req: Request, res: Response) => {
  const publicCats = [...categories]
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    success: true,
    categories: publicCats,
  });
});

app.get('/api/packs', (_req: Request, res: Response) => {
  const publicPacks = packs.filter((pk) => pk.isActive !== false);
  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    success: true,
    count: publicPacks.length,
    packs: publicPacks,
  });
});

// Record real order from Cart / Checkout / WhatsApp
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, totalAmountAr } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Données de commande invalides.' });
      return;
    }

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
          Number(item.totalPriceAr) || (Number(item.unitPriceAr) || 0) * (Number(item.quantity) || 1),
        image: item.image || null,
      })),
      totalAmountAr: Number(totalAmountAr) || 0,
      formattedTotal: `${new Intl.NumberFormat('fr-FR').format(Number(totalAmountAr) || 0)} Ar`,
      status: 'Nouvelle commande',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveJSON(ORDERS_PATH, orders);

    logAudit(
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
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Erreur enregistrement commande', details: err.message });
  }
});

// Public Analytics tracker (strictly anonymized)
app.post('/api/analytics/track', (req: Request, res: Response) => {
  try {
    const { page, productId, category } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);

    // Anonymized daily visitor hash (non-reversible, no IP saved)
    const ip = getClientIp(req);
    const ua = req.headers['user-agent'] || '';
    const anonVisitorHash = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(`${today}:${ip}:${ua}`)
      .digest('hex')
      .slice(0, 16);

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

    saveJSON(ANALYTICS_PATH, analytics);
    res.json({ success: true });
  } catch {
    res.status(200).json({ success: false });
  }
});

// Public health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'D SECURE Madagascar',
    publicCatalogCount: masterProducts.length,
    activePacksCount: packs.filter((p) => p.isActive !== false).length,
    activeOrdersCount: orders.length,
  });
});

// ==========================================
// 2. PROTECTED ADMIN API ROUTES
// ==========================================

// Admin Login with Rate Limiting & Scrypt Verification
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const now = Date.now();

  const attempt = loginAttempts.get(ip);
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

  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Mot de passe requis.' });
    return;
  }

  const isMatch = verifyAdminPassword(password);

  if (!isMatch) {
    const currentAttempt = attempt || { count: 0, lastAttempt: now, lockedUntil: 0 };
    currentAttempt.count += 1;
    currentAttempt.lastAttempt = now;

    if (currentAttempt.count >= 5) {
      currentAttempt.lockedUntil = now + 15 * 60 * 1000;
      loginAttempts.set(ip, currentAttempt);
      res.status(429).json({
        success: false,
        error: 'Trop de tentatives incorrectes. Votre accès est temporairement suspendu pendant 15 minutes.',
        locked: true,
      });
      return;
    }

    loginAttempts.set(ip, currentAttempt);
    const attemptsLeft = 5 - currentAttempt.count;
    res.status(401).json({
      success: false,
      error: `Mot de passe administrateur incorrect. (${attemptsLeft} tentative(s) restante(s))`,
      attemptsLeft,
    });
    return;
  }

  loginAttempts.delete(ip);

  const token = generateAdminToken();
  activeSessions.set(token, {
    token,
    createdAt: now,
    lastActiveAt: now,
    ip,
  });
  persistSessions();

  logAudit('ADMIN_LOGIN', 'admin', 'Direction D SECURE', 'Ouverture de session administrateur sécurisée');

  res.json({
    success: true,
    token,
    user: {
      role: 'administrator',
      name: 'Direction D SECURE',
      sessionTimeoutMinutes: 30,
    },
  });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (token) {
    activeSessions.delete(token);
    persistSessions();
  }
  res.json({ success: true, message: 'Déconnexion réussie.' });
});

// Admin Verify Token
app.get('/api/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    authenticated: true,
    role: 'administrator',
    serverTime: new Date().toISOString(),
  });
});

// Consolidated Dashboard Statistics (Strictly real counts)
app.get('/api/admin/dashboard-stats', requireAdminAuth, (_req: Request, res: Response) => {
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
    (o) => o.status === 'Nouvelle commande' || o.status === 'En attente de confirmation' || o.status === 'En préparation'
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
});

// Admin Products
app.get('/api/admin/products', requireAdminAuth, (_req: Request, res: Response) => {
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
});

// Create new product
app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
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
    } = req.body;

    if (!name || !reference) {
      res.status(400).json({ error: 'Le nom et la référence exacte sont obligatoires.' });
      return;
    }

    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const parsedSelling = sellingPriceAr !== undefined && sellingPriceAr !== null && sellingPriceAr !== '' ? Number(sellingPriceAr) : null;
    const parsedOriginal = originalPriceAr !== undefined && originalPriceAr !== null && originalPriceAr !== '' ? Number(originalPriceAr) : null;

    const newProduct = {
      id,
      name: String(name).trim(),
      reference: String(reference).trim(),
      description: description ? String(description).trim() : '',
      category: category ? String(category).trim() : 'Caméras de Surveillance',
      topSection: topSection || 'cameras',
      sellingPriceAr: parsedSelling,
      originalPriceAr: parsedOriginal,
      formattedPrice: parsedSelling ? `${new Intl.NumberFormat('fr-FR').format(parsedSelling)} Ar` : 'Prix sur demande',
      currency: 'Ar',
      image: image || null,
      images: image ? [image] : [],
      isAvailable: isAvailable !== false,
      displayOrder: displayOrder !== undefined && displayOrder !== '' ? Number(displayOrder) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    masterProducts.unshift(newProduct);
    saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
    syncPublicProducts();

    logAudit('PRODUCT_CREATED', newProduct.id, newProduct.reference, `Ajout du matériel ${newProduct.name} (${newProduct.formattedPrice})`);

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur création produit', details: err.message });
  }
});

// Update product + sync pack prices automatically if selling price changed
app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    } = req.body;

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
      formattedPrice: parsedSelling ? `${new Intl.NumberFormat('fr-FR').format(parsedSelling)} Ar` : 'Prix sur demande',
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

    // Detailed audit changes
    const changes: string[] = [];
    if (updated.sellingPriceAr !== current.sellingPriceAr) {
      changes.push(`Prix: ${current.formattedPrice} -> ${updated.formattedPrice}`);
    }
    if (updated.reference !== current.reference) {
      changes.push(`Réf: ${current.reference} -> ${updated.reference}`);
    }
    if (updated.image !== current.image) {
      changes.push(`Image modifiée`);
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
    saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
    syncPublicProducts();

    // Auto-recalculate pack prices if product price changed
    if (updated.sellingPriceAr !== current.sellingPriceAr) {
      recalculateAllPacksFromCatalog();
      logAudit(
        'PRICE_MODIFIED',
        updated.id,
        updated.reference,
        `${changes.join(' | ')} (Packs synchronisés)`
      );
    } else {
      logAudit(
        updated.reference !== current.reference ? 'REFERENCE_MODIFIED' : updated.image !== current.image ? 'IMAGE_MODIFIED' : 'PRODUCT_UPDATED',
        updated.id,
        updated.reference,
        changes.length > 0 ? changes.join(' | ') : `Mise à jour fiche ${updated.name}`
      );
    }

    res.json({
      success: true,
      product: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur mise à jour produit', details: err.message });
  }
});

// Toggle availability fast endpoint
app.patch('/api/admin/products/:id/availability', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = masterProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Produit non trouvé.' });
    return;
  }

  const { isAvailable } = req.body;
  const newStatus = typeof isAvailable === 'boolean' ? isAvailable : !(masterProducts[index].isAvailable !== false);

  masterProducts[index].isAvailable = newStatus;
  masterProducts[index].updatedAt = new Date().toISOString();

  saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
  syncPublicProducts();

  logAudit(
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
});

// Delete product (with automatic server snapshot backup before deletion)
app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = masterProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Produit non trouvé.' });
    return;
  }

  const target = masterProducts[index];
  createServerBackup(`Avant suppression produit ${target.reference}`);

  const deleted = masterProducts.splice(index, 1)[0];
  saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
  syncPublicProducts();

  logAudit('PRODUCT_DELETED', deleted.id, deleted.reference, `Suppression définitive du matériel ${deleted.name}`);

  res.json({
    success: true,
    deletedId: id,
    message: `Matériel ${deleted.reference} supprimé avec succès (sauvegarde effectuée).`,
  });
});

// -------------------------------------------------------------
// IMAGE UPLOAD & PICKER
// -------------------------------------------------------------
app.post('/api/admin/upload-image', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { filename, mimeType, dataBase64 } = req.body;

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

    // Strip data URI header if included
    const rawBase64 = dataBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const buffer = Buffer.from(rawBase64, 'base64');

    if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'Taille de fichier invalide (max 5 Mo).' });
      return;
    }

    // Magic bytes validation
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';

    if (!isJpeg && !isPng && !isWebp) {
      res.status(400).json({ error: 'Le contenu binaire du fichier ne correspond pas à une image valide.' });
      return;
    }

    const safeBase = (filename || 'produit')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 40);
    const uniqueName = `${safeBase}-${Date.now()}${ext}`;
    const destPath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(destPath, buffer);
    const webPath = `/images/uploads/${uniqueName}`;

    logAudit('IMAGE_UPLOADED', uniqueName, uniqueName, `Nouvelle image importée (${(buffer.length / 1024).toFixed(1)} KB) -> ${webPath}`);

    res.status(201).json({
      success: true,
      imagePath: webPath,
      filename: uniqueName,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Erreur lors de l'import de l'image.", details: err.message });
  }
});

app.get('/api/admin/available-images', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const publicImagesDir = path.resolve(__dirname, 'public', 'images');
    const aistudioDir = path.resolve(__dirname, 'public', 'assets', 'aistudio');

    // Track which product references currently use each image path (for duplicate prevention)
    const usageMap: Record<string, string[]> = {};
    masterProducts.forEach((p) => {
      if (p.image) {
        if (!usageMap[p.image]) usageMap[p.image] = [];
        usageMap[p.image].push(p.reference);
      }
    });

    const result: Array<{ path: string; name: string; category: string; usedBy: string[] }> = [];

    function scanDir(dir: string, baseWebPath: string, catName: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        if (ent.isDirectory()) {
          scanDir(path.join(dir, ent.name), `${baseWebPath}/${ent.name}`, ent.name);
        } else if (/\.(jpe?g|png|webp|jfif)$/i.test(ent.name)) {
          const webPath = `${baseWebPath}/${ent.name}`;
          result.push({
            path: webPath,
            name: ent.name,
            category: catName,
            usedBy: usageMap[webPath] || [],
          });
        }
      }
    }

    scanDir(publicImagesDir, '/images', 'Catalogue Hikvision');
    scanDir(aistudioDir, '/assets/aistudio', 'Photos D SECURE');

    res.json({
      success: true,
      count: result.length,
      images: result,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur scan images', details: err.message });
  }
});

// -------------------------------------------------------------
// CATEGORIES MANAGEMENT
// -------------------------------------------------------------
app.get('/api/admin/categories', requireAdminAuth, (_req: Request, res: Response) => {
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
});

app.post('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  const { name, topSection, description, image, order, isActive } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Le nom de la catégorie est obligatoire.' });
    return;
  }

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
  saveJSON(CATEGORIES_PATH, categories);

  logAudit('CATEGORY_MODIFIED', newCat.id, newCat.name, `Création de la catégorie ${newCat.name} (section ${newCat.topSection})`);

  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Catégorie non trouvée.' });
    return;
  }

  const oldName = categories[index].name;
  const { name, topSection, description, image, isActive, order, renameProductsCategory } = req.body;

  categories[index] = {
    ...categories[index],
    name: name !== undefined ? String(name).trim() : categories[index].name,
    topSection: topSection !== undefined ? topSection : categories[index].topSection,
    description: description !== undefined ? String(description).trim() : categories[index].description,
    image: image !== undefined ? image : categories[index].image,
    isActive: isActive !== undefined ? Boolean(isActive) : categories[index].isActive,
    order: order !== undefined ? Number(order) : categories[index].order,
  };

  // Preserve relations if renaming category explicitly requested
  if (renameProductsCategory && name && name.trim() !== oldName) {
    masterProducts.forEach((p) => {
      if (p.category === oldName) {
        p.category = name.trim();
      }
    });
    saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
    syncPublicProducts();
  }

  saveJSON(CATEGORIES_PATH, categories);
  logAudit('CATEGORY_MODIFIED', id, categories[index].name, `Mise à jour de la catégorie ${categories[index].name} (Active: ${categories[index].isActive ? 'OUI' : 'NON'}, Position: ${categories[index].order})`);

  res.json({ success: true, category: categories[index] });
});

// Associate or move products into a category without deleting any products
app.post('/api/admin/categories/:id/assign-products', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { productIds } = req.body;
  const cat = categories.find((c) => c.id === id);
  if (!cat) {
    res.status(404).json({ error: 'Catégorie non trouvée.' });
    return;
  }
  if (!Array.isArray(productIds) || productIds.length === 0) {
    res.status(400).json({ error: 'Aucun matériel sélectionné.' });
    return;
  }

  let updatedCount = 0;
  masterProducts.forEach((p) => {
    if (productIds.includes(p.id)) {
      p.category = cat.name;
      p.topSection = cat.topSection;
      p.updatedAt = new Date().toISOString();
      updatedCount++;
    }
  });

  saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
  syncPublicProducts();

  logAudit('CATEGORY_MODIFIED', id, cat.name, `${updatedCount} matériel(s) associé(s) à ${cat.name}`);
  res.json({ success: true, updatedCount });
});

// -------------------------------------------------------------
// PACKS MANAGEMENT (CRUD + Strict Separation + Auto BOM Pricing)
// -------------------------------------------------------------
app.get('/api/admin/packs', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: packs.length,
    packs,
  });
});

app.post('/api/admin/packs', requireAdminAuth, (req: Request, res: Response) => {
  try {
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

    const newPack = computePackTotals(
      {
        ...payload,
        id: payload.id || `pack-${payload.family || 'custom'}-${Date.now()}`,
        isActive: payload.isActive !== false,
        installationIncluded: payload.installationIncluded !== false,
      },
      Boolean(payload.syncFromCatalog)
    );

    packs.push(newPack);
    saveJSON(PACKS_PATH, packs);
    logAudit('PACK_CREATED', newPack.id, newPack.name, `Création du pack ${newPack.name} (${newPack.formattedPrice})`);

    res.status(201).json({ success: true, pack: newPack });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur création pack', details: err.message });
  }
});

app.put('/api/admin/packs/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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

    const updated = computePackTotals(merged, Boolean(req.body.syncFromCatalog));
    packs[index] = updated;
    saveJSON(PACKS_PATH, packs);

    logAudit(
      'PACK_MODIFIED',
      updated.id,
      updated.name,
      `Pack modifié : ${updated.name} -> Total ${updated.formattedPrice} (Actif: ${updated.isActive ? 'OUI' : 'NON'})`
    );

    res.json({ success: true, pack: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur modification pack', details: err.message });
  }
});

app.patch('/api/admin/packs/:id/toggle', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = packs.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Pack non trouvé.' });
    return;
  }

  const nextActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : !(packs[index].isActive !== false);
  packs[index].isActive = nextActive;
  packs[index].updatedAt = new Date().toISOString();
  saveJSON(PACKS_PATH, packs);

  logAudit('PACK_MODIFIED', id, packs[index].name, `Pack ${nextActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'} sur le site public`);
  res.json({ success: true, id, isActive: nextActive });
});

app.post('/api/admin/packs/recalculate-all', requireAdminAuth, (_req: Request, res: Response) => {
  recalculateAllPacksFromCatalog();
  logAudit('PACK_MODIFIED', 'all-packs', 'Tous les packs', 'Recalcul automatique des prix de tous les packs selon le catalogue actuel');
  res.json({ success: true, packs });
});

app.delete('/api/admin/packs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = packs.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Pack non trouvé.' });
    return;
  }

  createServerBackup(`Avant suppression pack ${packs[index].name}`);
  const deleted = packs.splice(index, 1)[0];
  saveJSON(PACKS_PATH, packs);
  logAudit('PACK_DELETED', id, deleted.name, `Suppression du pack ${deleted.name}`);
  res.json({ success: true, deletedId: id });
});

// -------------------------------------------------------------
// ORDERS & CUSTOMERS
// -------------------------------------------------------------
app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  const statusFilter = req.query.status as string;
  let result = orders;
  if (statusFilter && statusFilter !== 'all') {
    result = orders.filter((o) => o.status === statusFilter);
  }
  res.json({ success: true, count: result.length, orders: result });
});

app.patch('/api/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Commande non trouvée.' });
    return;
  }

  const { status, internalNotes } = req.body;
  const oldStatus = orders[index].status;
  orders[index].status = status || oldStatus;
  if (internalNotes !== undefined) {
    orders[index].internalNotes = internalNotes;
  }
  orders[index].updatedAt = new Date().toISOString();

  saveJSON(ORDERS_PATH, orders);

  logAudit(
    'ORDER_STATUS_CHANGED',
    id,
    orders[index].orderNumber,
    `Statut commande ${orders[index].orderNumber} changé : ${oldStatus} -> ${orders[index].status}`
  );

  res.json({ success: true, order: orders[index] });
});

app.get('/api/admin/customers', requireAdminAuth, (_req: Request, res: Response) => {
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
});

// -------------------------------------------------------------
// ANALYTICS, AUDIT LOGS & BACKUPS
// -------------------------------------------------------------
app.get('/api/admin/analytics', requireAdminAuth, (_req: Request, res: Response) => {
  // Resolve top viewed product details cleanly
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
});

app.get('/api/admin/audit-logs', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: auditLogs.length,
    logs: auditLogs,
  });
});

app.post('/api/admin/backups', requireAdminAuth, (_req: Request, res: Response) => {
  const filename = createServerBackup('Sauvegarde manuelle administrateur');
  logAudit('BACKUP_CREATED', filename, filename, `Sauvegarde complète créée sur le serveur (${filename})`);
  res.status(201).json({ success: true, filename });
});

app.get('/api/admin/backups', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const files = fs
      .readdirSync(BACKUPS_DIR)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .reverse()
      .map((name) => {
        const stat = fs.statSync(path.join(BACKUPS_DIR, name));
        return {
          name,
          sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
          createdAt: stat.mtime,
        };
      });
    res.json({ success: true, backups: files });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur lecture sauvegardes', details: err.message });
  }
});

app.get('/api/admin/export-database', requireAdminAuth, (_req: Request, res: Response) => {
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

  res.setHeader('Content-Disposition', `attachment; filename="D_SECURE_BACKUP_${Date.now()}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportPayload, null, 2));
});

app.get('/api/admin/files', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    if (!fs.existsSync(INTERNAL_DOCS_DIR)) {
      res.json({ success: true, files: [] });
      return;
    }

    const fileNames = fs.readdirSync(INTERNAL_DOCS_DIR);
    const files = fileNames.map((name) => {
      const filePath = path.join(INTERNAL_DOCS_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        name,
        sizeBytes: stat.size,
        sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
        modifiedAt: stat.mtime,
      };
    });

    res.json({ success: true, files });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur lecture fichiers internes', details: err.message });
  }
});

app.get('/api/admin/files/:filename', requireAdminAuth, (req: Request, res: Response) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(INTERNAL_DOCS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Fichier non trouvé.' });
    return;
  }

  res.download(filePath, filename);
});

// ==========================================
// 3. FRONTEND VITE INTEGRATION
// ==========================================

async function setupFrontend() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`D SECURE Server active on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
