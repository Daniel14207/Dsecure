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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dsecure2026!';

// Secret key for hashing admin session tokens
const TOKEN_SECRET = process.env.ADMIN_SECRET || 'dsecure-super-secret-salt-2026';

app.use(express.json());

// Security middleware: explicitly block any direct static access to data spreadsheets or CSVs
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

// Load master data server-side only
const MASTER_PRODUCTS_PATH = path.resolve(__dirname, 'server', 'data', 'master-products.json');
const INTERNAL_DOCS_DIR = path.resolve(__dirname, 'server', 'data', 'internal');

let masterProducts: any[] = [];
try {
  if (fs.existsSync(MASTER_PRODUCTS_PATH)) {
    masterProducts = JSON.parse(fs.readFileSync(MASTER_PRODUCTS_PATH, 'utf-8'));
  }
} catch (e) {
  console.error('Error loading master products server-side:', e);
}

// Generate sanitized public products (strictly NO originalPriceAr, NO sourceWorkbook, NO sourceSheet, NO sourceRow, NO issue, NO validationStatus)
const sanitizedPublicProducts = masterProducts.map((p) => ({
  id: p.id,
  category: p.category,
  name: p.name,
  reference: p.reference,
  description: p.description,
  sellingPriceAr: p.sellingPriceAr,
  formattedPrice: p.formattedPrice,
  currency: p.currency || 'Ar',
  image: p.image,
  images: p.images || (p.image ? [p.image] : []),
  topSection: p.topSection,
}));

// Admin token helper
function generateAdminToken(): string {
  const payload = `admin-${Date.now()}-${Math.random()}`;
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

// Middleware to protect admin routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!verifyAdminToken(token)) {
    res.status(401).json({
      error: 'Accès non autorisé. Authentification administrateur requise.',
      code: 'UNAUTHORIZED',
    });
    return;
  }
  next();
}

// ==========================================
// 1. PUBLIC API ROUTES (Zero Confidential Data)
// ==========================================

// Public products endpoint
app.get('/api/products', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json({
    success: true,
    count: sanitizedPublicProducts.length,
    products: sanitizedPublicProducts,
  });
});

// Public health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'D SECURE Madagascar',
    tagline: 'Votre sécurité, notre priorité.',
    publicCatalogCount: sanitizedPublicProducts.length,
  });
});

// ==========================================
// 2. PROTECTED ADMIN API ROUTES
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    res.status(400).json({ error: 'Mot de passe requis.' });
    return;
  }

  // Timing safe comparison to protect against timing attacks
  const inputBuffer = Buffer.from(password);
  const targetBuffer = Buffer.from(ADMIN_PASSWORD);

  const isMatch =
    inputBuffer.length === targetBuffer.length &&
    crypto.timingSafeEqual(inputBuffer, targetBuffer);

  if (!isMatch) {
    res.status(401).json({
      success: false,
      error: 'Mot de passe administrateur incorrect.',
    });
    return;
  }

  const token = generateAdminToken();
  res.json({
    success: true,
    token,
    user: {
      role: 'administrator',
      name: 'Direction D SECURE',
      permissions: ['view_purchase_prices', 'view_excel_sources', 'view_audit_reports', 'export_data'],
    },
  });
});

// Admin Verify Token
app.get('/api/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    authenticated: true,
    role: 'administrator',
  });
});

// Admin Products (Confidential master data with purchase prices & margins)
app.get('/api/admin/products', requireAdminAuth, (_req: Request, res: Response) => {
  // Enrich master products with calculated margins
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

// Admin Audit Summary Statistics
app.get('/api/admin/audit-summary', requireAdminAuth, (_req: Request, res: Response) => {
  let totalPurchaseValueAr = 0;
  let totalSellingValueAr = 0;
  let withPriceCount = 0;
  let missingPriceCount = 0;
  let withImageCount = 0;
  let flaggedCount = 0;
  const sheetDistribution: { [key: string]: number } = {};

  masterProducts.forEach((p) => {
    const sheet = p.sourceSheet || 'Inconnu';
    sheetDistribution[sheet] = (sheetDistribution[sheet] || 0) + 1;

    if (p.image) withImageCount++;
    if (p.issue) flaggedCount++;

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

  res.json({
    success: true,
    summary: {
      totalCount: masterProducts.length,
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
      pricingFormulas: {
        alarmRule: "Systèmes d'alarme (tous matériels filaires & sans fil) : Vente = Achat × 2.00 (+100%) quel que soit le montant",
        generalLower: 'Autres équipements (Achat ≤ 300 000 Ar) : Vente = Achat × 2.00 (+100%)',
        generalUpper: 'Autres équipements (Achat > 300 000 Ar) : Vente = Achat × 1.90 (+90%)',
        missingPolicy: 'Prix non renseigné : Affichage « Prix sur demande »',
      },
    },
  });
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
