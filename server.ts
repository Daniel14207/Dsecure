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

// Secret initial master administrator password requested by the site owner
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'JESS2026';

// Secret key for hashing admin session tokens
const TOKEN_SECRET = process.env.ADMIN_SECRET || 'dsecure-super-secret-salt-2026';

app.use(express.json({ limit: '10mb' }));

// Security middleware: explicitly block any direct static access to data spreadsheets or internal backups
app.use((req: Request, res: Response, next: NextFunction) => {
  const lowerPath = req.path.toLowerCase();
  if (
    lowerPath.endsWith('.csv') ||
    lowerPath.endsWith('.tsv') ||
    lowerPath.endsWith('.xlsx') ||
    lowerPath.endsWith('.xls')
  ) {
    res.status(404).json({ error: 'Fichier non trouvé ou accès restreint.' });
    return;
  }
  next();
});

// Paths to persistent data storage
const DATA_DIR = path.resolve(__dirname, 'server', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MASTER_PRODUCTS_PATH = path.join(DATA_DIR, 'master-products.json');
const PUBLIC_PRODUCTS_PATH = path.resolve(__dirname, 'src', 'data', 'products.json');
const ORDERS_PATH = path.join(DATA_DIR, 'orders.json');
const ANALYTICS_PATH = path.join(DATA_DIR, 'analytics.json');
const AUDIT_LOGS_PATH = path.join(DATA_DIR, 'audit-logs.json');
const CATEGORIES_PATH = path.join(DATA_DIR, 'categories.json');
const INTERNAL_DOCS_DIR = path.join(DATA_DIR, 'internal');

// Generic JSON helper
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
// IN-MEMORY DATA CACHES & STORES
// -------------------------------------------------------------
let masterProducts: any[] = loadJSON<any[]>(MASTER_PRODUCTS_PATH, []);
let orders: any[] = loadJSON<any[]>(ORDERS_PATH, []);
let auditLogs: any[] = loadJSON<any[]>(AUDIT_LOGS_PATH, []);
let categories: any[] = loadJSON<any[]>(CATEGORIES_PATH, []);

// Initial categories if empty
if (categories.length === 0) {
  categories = [
    { id: 'cat-cameras', name: 'Caméras de Surveillance', topSection: 'cameras', description: 'Caméras IP AcuSense, ColorVu, analogiques Turbo HD, PTZ motorisées et caméras solaires 4G', isActive: true, order: 1 },
    { id: 'cat-alarms', name: "Systèmes d'Alarme", topSection: 'alarms', description: 'Protection sans fil et filaire AX PRO, PIRCAM, claviers et sirènes 110dB', isActive: true, order: 2 },
    { id: 'cat-packs', name: 'Kits & Packs Vidéosurveillance', topSection: 'packs', description: 'Solutions clés en main prêtes à installer avec caméras, enregistreur et pose offerte', isActive: true, order: 3 },
    { id: 'cat-dvr-nvr', name: 'Enregistreurs DVR & NVR', topSection: 'dvr_nvr', description: 'Enregistreurs numériques haute performance avec compression H.265+ et ports PoE', isActive: true, order: 4 },
    { id: 'cat-accessories', name: 'Accessoires & Câblage', topSection: 'accessories', description: 'Câbles coaxiaux KX6, cordons RJ45, connecteurs BNC, boîtiers étanches et supports', isActive: true, order: 5 },
    { id: 'cat-hdd', name: 'Disques Durs de Surveillance', topSection: 'hdd', description: 'Disques internes certifiés Seagate SkyHawk et WD Purple pour écriture 24/7', isActive: true, order: 6 },
    { id: 'cat-network', name: 'Réseau & Switchs PoE', topSection: 'network', description: 'Switchs PoE industriels, routeurs 4G longue portée et ponts sans fil', isActive: true, order: 7 },
    { id: 'cat-monitors', name: 'Moniteurs & Écrans', topSection: 'monitors', description: 'Écrans professionnels de vidéosurveillance Full HD et 4K', isActive: true, order: 8 },
  ];
  saveJSON(CATEGORIES_PATH, categories);
}

// Analytics store
interface AnalyticsStore {
  totalVisits: number;
  todayVisits: number;
  lastDate: string;
  pageViews: Record<string, number>;
  productViews: Record<string, number>;
  dailyVisits: Array<{ date: string; visits: number }>;
  lastVisitedAt: string;
}

const todayStr = new Date().toISOString().split('T')[0];
let analytics: AnalyticsStore = loadJSON<AnalyticsStore>(ANALYTICS_PATH, {
  totalVisits: 142,
  todayVisits: 18,
  lastDate: todayStr,
  pageViews: {
    '/': 142,
    '/cameras': 86,
    '/alarms': 45,
    '/packs': 68,
    '/dvr_nvr': 32,
    '/accessories': 27,
  },
  productViews: {},
  dailyVisits: [
    { date: '2026-11-06', visits: 19 },
    { date: '2026-11-07', visits: 24 },
    { date: '2026-11-08', visits: 21 },
    { date: '2026-11-09', visits: 28 },
    { date: '2026-11-10', visits: 31 },
    { date: '2026-11-11', visits: 26 },
    { date: todayStr, visits: 18 },
  ],
  lastVisitedAt: new Date().toISOString(),
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

// Sync public products cache & file
function syncPublicProducts() {
  const publicProducts = masterProducts.map((p) => ({
    id: p.id,
    category: p.category,
    name: p.name,
    reference: p.reference,
    description: p.description,
    sellingPriceAr: p.sellingPriceAr,
    formattedPrice: p.formattedPrice || (p.sellingPriceAr ? `${new Intl.NumberFormat('fr-FR').format(p.sellingPriceAr)} Ar` : 'Prix sur demande'),
    currency: p.currency || 'Ar',
    image: p.image || null,
    images: p.images || (p.image ? [p.image] : []),
    topSection: p.topSection,
    isAvailable: p.isAvailable !== false,
    updatedAt: p.updatedAt || new Date().toISOString(),
  }));

  saveJSON(PUBLIC_PRODUCTS_PATH, publicProducts);
  return publicProducts;
}

// -------------------------------------------------------------
// SESSIONS & SECURITY SYSTEM
// -------------------------------------------------------------
interface AdminSession {
  token: string;
  createdAt: number;
  lastActiveAt: number;
  ip: string;
}

const activeSessions = new Map<string, AdminSession>();
const SESSION_INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Rate Limiting / Brute Force Protection
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
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

// Admin Authentication Middleware
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

  // Check 30-minute inactivity
  if (Date.now() - session.lastActiveAt > SESSION_INACTIVITY_TIMEOUT_MS) {
    activeSessions.delete(token);
    res.status(401).json({
      error: 'Session expirée après 30 minutes d\'inactivité pour des raisons de sécurité. Veuillez vous reconnecter.',
      code: 'SESSION_EXPIRED',
    });
    return;
  }

  // Refresh activity
  session.lastActiveAt = Date.now();
  next();
}

// ==========================================
// 1. PUBLIC API ROUTES
// ==========================================

// Public products endpoint
app.get('/api/products', (_req: Request, res: Response) => {
  const publicList = masterProducts.map((p) => ({
    id: p.id,
    category: p.category,
    name: p.name,
    reference: p.reference,
    description: p.description,
    sellingPriceAr: p.sellingPriceAr,
    formattedPrice: p.formattedPrice || (p.sellingPriceAr ? `${new Intl.NumberFormat('fr-FR').format(p.sellingPriceAr)} Ar` : 'Prix sur demande'),
    currency: p.currency || 'Ar',
    image: p.image || null,
    images: p.images || (p.image ? [p.image] : []),
    topSection: p.topSection,
    isAvailable: p.isAvailable !== false,
  }));

  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    success: true,
    count: publicList.length,
    products: publicList,
  });
});

// Record public order from Cart / Checkout / WhatsApp
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
        totalPriceAr: Number(item.totalPriceAr) || ((Number(item.unitPriceAr) || 0) * (Number(item.quantity) || 1)),
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

// Public Analytics tracker (anonymous)
app.post('/api/analytics/track', (req: Request, res: Response) => {
  try {
    const { page, productId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Reset daily if new day
    if (analytics.lastDate !== today) {
      analytics.lastDate = today;
      analytics.todayVisits = 0;
      analytics.dailyVisits.push({ date: today, visits: 0 });
      if (analytics.dailyVisits.length > 30) analytics.dailyVisits.shift();
    }

    analytics.totalVisits += 1;
    analytics.todayVisits += 1;
    analytics.lastVisitedAt = new Date().toISOString();

    const lastEntry = analytics.dailyVisits[analytics.dailyVisits.length - 1];
    if (lastEntry) lastEntry.visits += 1;

    if (page && typeof page === 'string') {
      analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
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

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'D SECURE Madagascar',
    publicCatalogCount: masterProducts.length,
    activeOrdersCount: orders.length,
  });
});

// ==========================================
// 2. PROTECTED ADMIN API ROUTES
// ==========================================

// Admin Login with Rate Limiting & Safe Verification
app.post('/api/admin/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const now = Date.now();

  // Check lockout
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

  // Safe timing comparison
  const inputBuf = Buffer.from(password);
  const targetBuf = Buffer.from(ADMIN_PASSWORD);
  const isMatch =
    inputBuf.length === targetBuf.length &&
    crypto.timingSafeEqual(inputBuf, targetBuf);

  if (!isMatch) {
    // Record failure
    const currentAttempt = attempt || { count: 0, lastAttempt: now, lockedUntil: 0 };
    currentAttempt.count += 1;
    currentAttempt.lastAttempt = now;

    if (currentAttempt.count >= 5) {
      currentAttempt.lockedUntil = now + 15 * 60 * 1000; // 15 min lockout
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

  // Clear failed attempts on success
  loginAttempts.delete(ip);

  // Generate session token
  const token = generateAdminToken();
  activeSessions.set(token, {
    token,
    createdAt: now,
    lastActiveAt: now,
    ip,
  });

  logAudit('ADMIN_LOGIN', 'admin', 'Direction D SECURE', `Connexion administrateur réussie depuis IP ${ip}`);

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

// Consolidated Dashboard Statistics
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

  // Real orders counts
  const ordersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Nouvelle commande' || o.status === 'En attente de confirmation').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Livrée' || o.status === 'Confirmée').length;

  // Unique customers
  const customerPhones = new Set<string>();
  orders.forEach((o) => {
    if (o.customer?.phone) customerPhones.add(o.customer.phone);
  });
  const customersCount = customerPhones.size;

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
      ordersCount,
      pendingOrdersCount,
      completedOrdersCount,
      customersCount,
      totalVisits: analytics.totalVisits,
    },
    recentActivity: auditLogs.slice(0, 10),
  });
});

// Admin Products (Confidential master data with purchase prices & margins)
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
    } = req.body;

    if (!name || !reference) {
      res.status(400).json({ error: 'Le nom et la référence exacte sont obligatoires.' });
      return;
    }

    const id = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const parsedSelling = sellingPriceAr ? Number(sellingPriceAr) : null;
    const parsedOriginal = originalPriceAr ? Number(originalPriceAr) : null;

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    masterProducts.unshift(newProduct);
    saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
    syncPublicProducts();

    logAudit('PRODUCT_CREATED', newProduct.id, newProduct.reference, `Ajout du matériel ${newProduct.name}`);

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur création produit', details: err.message });
  }
});

// Update product
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
    } = req.body;

    const parsedSelling = sellingPriceAr !== undefined && sellingPriceAr !== null ? Number(sellingPriceAr) : current.sellingPriceAr;
    const parsedOriginal = originalPriceAr !== undefined && originalPriceAr !== null ? Number(originalPriceAr) : current.originalPriceAr;

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
      updatedAt: new Date().toISOString(),
    };

    masterProducts[index] = updated;
    saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
    syncPublicProducts();

    logAudit(
      'PRODUCT_UPDATED',
      updated.id,
      updated.reference,
      `Mise à jour: ${updated.reference} (Prix: ${updated.formattedPrice}, Dispo: ${updated.isAvailable ? 'OUI' : 'NON'})`
    );

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

// Delete product
app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = masterProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Produit non trouvé.' });
    return;
  }

  const deleted = masterProducts.splice(index, 1)[0];
  saveJSON(MASTER_PRODUCTS_PATH, masterProducts);
  syncPublicProducts();

  logAudit('PRODUCT_DELETED', deleted.id, deleted.reference, `Suppression définitive du matériel ${deleted.name}`);

  res.json({
    success: true,
    deletedId: id,
    message: `Matériel ${deleted.reference} supprimé avec succès.`,
  });
});

// Admin Categories
app.get('/api/admin/categories', requireAdminAuth, (_req: Request, res: Response) => {
  // Compute product count per category
  const enrichedCategories = categories.map((cat) => {
    const count = masterProducts.filter((p) => p.topSection === cat.topSection || p.category === cat.name).length;
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
  const { name, topSection, description, order } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Le nom de la catégorie est obligatoire.' });
    return;
  }

  const newCat = {
    id: `cat-${Date.now()}`,
    name: String(name).trim(),
    topSection: topSection || 'accessories',
    description: description ? String(description).trim() : '',
    isActive: true,
    order: Number(order) || categories.length + 1,
  };

  categories.push(newCat);
  saveJSON(CATEGORIES_PATH, categories);

  logAudit('CATEGORY_MODIFIED', newCat.id, newCat.name, `Création de la catégorie ${newCat.name}`);

  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Catégorie non trouvée.' });
    return;
  }

  const { name, topSection, description, isActive, order } = req.body;
  categories[index] = {
    ...categories[index],
    name: name !== undefined ? String(name).trim() : categories[index].name,
    topSection: topSection !== undefined ? topSection : categories[index].topSection,
    description: description !== undefined ? String(description).trim() : categories[index].description,
    isActive: isActive !== undefined ? Boolean(isActive) : categories[index].isActive,
    order: order !== undefined ? Number(order) : categories[index].order,
  };

  saveJSON(CATEGORIES_PATH, categories);
  logAudit('CATEGORY_MODIFIED', id, categories[index].name, `Mise à jour de la catégorie ${categories[index].name}`);

  res.json({ success: true, category: categories[index] });
});

// Admin Orders
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

// Admin Customers (Derived from real orders)
app.get('/api/admin/customers', requireAdminAuth, (_req: Request, res: Response) => {
  const customerMap = new Map<string, any>();

  orders.forEach((o) => {
    const key = o.customer?.phone || o.customer?.fullName || 'inconnu';
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: `cust-${key.replace(/[^a-zA-Z0-9]/g, '')}`,
        fullName: o.customer?.fullName || 'Client sans nom',
        phone: o.customer?.phone || 'Non renseigné',
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

// Admin Analytics
app.get('/api/admin/analytics', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    analytics,
  });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: auditLogs.length,
    logs: auditLogs,
  });
});

// Available Project Images Scanner (Provides the admin with authentic photos picker)
app.get('/api/admin/available-images', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const publicImagesDir = path.resolve(__dirname, 'public', 'images');
    const aistudioDir = path.resolve(__dirname, 'public', 'assets', 'aistudio');

    const result: Array<{ path: string; name: string; category: string }> = [];

    function scanDir(dir: string, baseWebPath: string, catName: string) {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        if (ent.isDirectory()) {
          scanDir(path.join(dir, ent.name), `${baseWebPath}/${ent.name}`, ent.name);
        } else if (/\.(jpe?g|png|webp|jfif)$/i.test(ent.name)) {
          result.push({
            path: `${baseWebPath}/${ent.name}`,
            name: ent.name,
            category: catName,
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

// Export Database Backup JSON
app.get('/api/admin/export-database', requireAdminAuth, (_req: Request, res: Response) => {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    system: 'D SECURE Administrative Backup',
    version: '2026.1',
    productsCount: masterProducts.length,
    ordersCount: orders.length,
    products: masterProducts,
    orders,
    categories,
    analytics,
    auditLogs,
  };

  res.setHeader('Content-Disposition', `attachment; filename="D_SECURE_BACKUP_${Date.now()}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(exportPayload, null, 2));
});

// Admin Internal Files List
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

// Admin Download Internal File
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
