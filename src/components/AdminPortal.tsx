import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lock,
  Shield,
  DollarSign,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle2,
  Search,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  Users,
  ShoppingCart,
  Package,
  Clock,
  BarChart3,
  Database,
  Save,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Upload,
  FolderKanban,
  Power,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import {
  AdminProduct,
  AdminAuditSummary,
  Product,
  Order,
  Customer,
  AuditLogEntry,
  AnalyticsData,
  CategoryItem,
  OrderStatus
} from '../types/product';
import { SurveillancePack, PackComponentBOM } from '../data/surveillancePacks';
import { formatAr } from '../utils/whatsapp';

interface AdminPortalProps {
  onBackToPublicSite: () => void;
  onCatalogUpdated?: (products: Product[]) => void;
}

type AdminTab =
  | 'overview'
  | 'products'
  | 'availability'
  | 'prices'
  | 'categories'
  | 'packs'
  | 'orders'
  | 'customers'
  | 'analytics'
  | 'audit';

interface AvailableImageItem {
  path: string;
  name: string;
  category: string;
  usedBy?: string[];
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToPublicSite,
  onCatalogUpdated,
}) => {
  // Session token held strictly in memory
  const [token, setToken] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    mode: string;
    persistent: boolean;
    runtime: string;
    blobEnabled: boolean;
    warning: string | null;
  } | null>(null);

  // Login form state - strictly empty on open
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Inactivity timeout (30 minutes)
  const lastActivityRef = useRef<number>(Date.now());
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(30 * 60);

  // Navigation & mobile sidebar
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Datasets
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [packs, setPacks] = useState<SurveillancePack[]>([]);
  const [summary, setSummary] = useState<AdminAuditSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<(AnalyticsData & { topProducts?: any[] }) | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [availableImages, setAvailableImages] = useState<AvailableImageItem[]>([]);
  const [serverBackups, setServerBackups] = useState<Array<{ name: string; sizeFormatted: string; createdAt: string }>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Pagination
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(30);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [imageSearchQuery, setImageSearchQuery] = useState('');

  // Product Modals
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);

  // Image Picker & Upload Modals
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerCallback, setImagePickerCallback] = useState<((path: string) => void) | null>(null);
  const [pendingUploadPreview, setPendingUploadPreview] = useState<{
    filename: string;
    mimeType: string;
    dataBase64: string;
  } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Category Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> & { renameProductsCategory?: boolean } | null>(null);
  const [assignCategoryTarget, setAssignCategoryTarget] = useState<CategoryItem | null>(null);
  const [selectedProductIdsForAssign, setSelectedProductIdsForAssign] = useState<string[]>([]);
  const [assignSearch, setAssignSearch] = useState('');

  // Pack Modals
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Partial<SurveillancePack> | null>(null);
  const [packToDelete, setPackToDelete] = useState<SurveillancePack | null>(null);

  // Orders & Customers Modals
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderNotesInput, setOrderNotesInput] = useState('');
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState<Customer | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // INACTIVITY MONITORING (Auto-logout after 30 min)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now();
      setSessionTimeRemaining(30 * 60);
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    const interval = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = 30 * 60 - elapsedSec;
      if (remaining <= 0) {
        handleLogout('Session fermée automatiquement après 30 minutes d\'inactivité.');
      } else {
        setSessionTimeRemaining(remaining);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      clearInterval(interval);
    };
  }, [token]);

  const safeParseApiJson = async (res: Response): Promise<any> => {
    const rawText = await res.text();
    try {
      return rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(
        `Réponse invalide du serveur (HTTP ${res.status}). Vérifiez que les fonctions API (/api) sont bien déployées.`
      );
    }
  };

  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setLoginError('Veuillez entrer le mot de passe administrateur.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await safeParseApiJson(res);
      if (!res.ok || !data.success) {
        setLoginError(data.error || `Accès refusé (HTTP ${res.status}).`);
        setIsLoggingIn(false);
        return;
      }

      setToken(data.token);
      if (data.storageInfo) setStorageInfo(data.storageInfo);
      setPasswordInput('');
      lastActivityRef.current = Date.now();
      showToast('Connexion sécurisée établie. Bienvenue dans l\'espace D SECURE.');
    } catch (err: any) {
      setLoginError(
        err?.message && !err.message.includes('Failed to fetch')
          ? err.message
          : 'Erreur de communication avec le serveur (/api/admin/login inaccessible).'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async (reason?: string) => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    setToken(null);
    setStorageInfo(null);
    setPasswordInput('');
    setProducts([]);
    setOrders([]);
    setCustomers([]);
    if (reason) {
      setLoginError(reason);
    }
  };

  // -------------------------------------------------------------
  // DATA LOADING
  // -------------------------------------------------------------
  const loadAllAdminData = async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const sRes = await fetch('/api/admin/dashboard-stats', { headers });
      if (sRes.status === 401) {
        handleLogout('Votre session a expiré. Veuillez vous reconnecter.');
        return;
      }
      const sData = await safeParseApiJson(sRes);
      if (sData.success) setSummary(sData.summary);
      if (sData.storageInfo) setStorageInfo(sData.storageInfo);

      const [pRes, pkRes, oRes, cRes, aRes, lRes, catRes, imgRes, bkpRes] = await Promise.all([
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/packs', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/customers', { headers }),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/categories', { headers }),
        fetch('/api/admin/available-images', { headers }),
        fetch('/api/admin/backups', { headers }),
      ]);

      const [pData, pkData, oData, cData, aData, lData, catData, imgData, bkpData] = await Promise.all([
        safeParseApiJson(pRes),
        safeParseApiJson(pkRes),
        safeParseApiJson(oRes),
        safeParseApiJson(cRes),
        safeParseApiJson(aRes),
        safeParseApiJson(lRes),
        safeParseApiJson(catRes),
        safeParseApiJson(imgRes),
        safeParseApiJson(bkpRes),
      ]);

      if (pData.success) {
        setProducts(pData.products);
        if (onCatalogUpdated) onCatalogUpdated(pData.products);
      }
      if (pkData.success) setPacks(pkData.packs);
      if (oData.success) setOrders(oData.orders);
      if (cData.success) setCustomers(cData.customers);
      if (aData.success) setAnalytics(aData.analytics);
      if (lData.success) setAuditLogs(lData.logs);
      if (catData.success) setCategories(catData.categories);
      if (imgData.success) setAvailableImages(imgData.images);
      if (bkpData.success) setServerBackups(bkpData.backups);
    } catch (err) {
      console.error('Error loading admin data:', err);
      showToast('Erreur lors du chargement des données administratives.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllAdminData();
    }
  }, [token]);

  // -------------------------------------------------------------
  // PRODUCT CRUD HANDLERS
  // -------------------------------------------------------------
  const handleToggleAvailability = async (product: AdminProduct) => {
    const nextStatus = !(product.isAvailable !== false);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/availability`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: nextStatus }),
      });

      const data = await res.json();
      if (data.success) {
        const nextProducts = products.map((p) =>
          p.id === product.id ? { ...p, isAvailable: nextStatus } : p
        );
        setProducts(nextProducts);
        if (onCatalogUpdated) onCatalogUpdated(nextProducts);
        showToast(`${product.reference} : ${nextStatus ? 'DISPONIBLE' : 'INDISPONIBLE'}`);
      } else {
        showToast(data.error || 'Erreur lors de la modification.', 'error');
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.reference?.trim() || !editingProduct.name?.trim()) {
      showToast('La référence et le nom du matériel sont obligatoires.', 'error');
      return;
    }

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditProductModalOpen(false);
        setEditingProduct(null);
        await loadAllAdminData();
        showToast(isNew ? 'Nouveau matériel ajouté au catalogue !' : 'Matériel mis à jour et synchronisé !');
      } else {
        showToast(data.error || "Erreur lors de l'enregistrement.", 'error');
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        await loadAllAdminData();
        showToast(data.message || 'Matériel supprimé (sauvegarde créée).');
      } else {
        showToast(data.error || 'Erreur lors de la suppression.', 'error');
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  const handleInlinePriceRefSave = async (
    productId: string,
    updates: { reference: string; name: string; sellingPriceAr: number | null; originalPriceAr: number | null }
  ) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        await loadAllAdminData();
        showToast(`Référence & prix mis à jour (${updates.reference}) — Packs synchronisés !`);
      } else {
        showToast(data.error || 'Erreur mise à jour.', 'error');
      }
    } catch {
      showToast('Erreur serveur.', 'error');
    }
  };

  // -------------------------------------------------------------
  // IMAGE UPLOAD & SELECTION HANDLERS
  // -------------------------------------------------------------
  const openImagePicker = (onSelect: (imagePath: string) => void) => {
    setImagePickerCallback(() => onSelect);
    setPendingUploadPreview(null);
    setImageSearchQuery('');
    setIsImagePickerOpen(true);
  };

  const handleFileSelectForUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Format non supporté. Utilisez JPG, PNG ou WEBP.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image trop lourde (maximum 5 Mo).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Vercel Serverless body limit is ~4.5MB; compress images > 2.2MB automatically on canvas
      if (file.size > 2.2 * 1024 * 1024) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const targetMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
            const compressed = canvas.toDataURL(targetMime, 0.85);
            setPendingUploadPreview({
              filename: file.name,
              mimeType: targetMime,
              dataBase64: compressed,
            });
            return;
          }
          setPendingUploadPreview({ filename: file.name, mimeType: file.type, dataBase64: result });
        };
        img.src = result;
        return;
      }

      setPendingUploadPreview({
        filename: file.name,
        mimeType: file.type,
        dataBase64: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImageUpload = async () => {
    if (!pendingUploadPreview) return;
    setIsUploadingImage(true);
    try {
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingUploadPreview),
      });

      const data = await res.json();
      if (data.success && data.imagePath) {
        showToast('Nouvelle image importée et validée !');
        if (imagePickerCallback) {
          imagePickerCallback(data.imagePath);
        }
        setPendingUploadPreview(null);
        setIsImagePickerOpen(false);
        loadAllAdminData();
      } else {
        showToast(data.error || "Erreur lors de l'import image.", 'error');
      }
    } catch {
      showToast('Erreur réseau lors de l\'envoi.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // -------------------------------------------------------------
  // CATEGORY CRUD HANDLERS
  // -------------------------------------------------------------
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name?.trim()) {
      showToast('Le nom de la catégorie est obligatoire.', 'error');
      return;
    }

    try {
      const isNew = !editingCategory.id;
      const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${editingCategory.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCategory),
      });

      const data = await res.json();
      if (data.success) {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        await loadAllAdminData();
        showToast(isNew ? 'Catégorie créée avec succès !' : 'Catégorie mise à jour !');
      } else {
        showToast(data.error || 'Erreur catégorie.', 'error');
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  const handleAssignProductsToCategory = async () => {
    if (!assignCategoryTarget || selectedProductIdsForAssign.length === 0) return;
    try {
      const res = await fetch(`/api/admin/categories/${assignCategoryTarget.id}/assign-products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: selectedProductIdsForAssign }),
      });

      const data = await res.json();
      if (data.success) {
        setAssignCategoryTarget(null);
        setSelectedProductIdsForAssign([]);
        await loadAllAdminData();
        showToast(`${data.updatedCount} matériel(s) déplacé(s) vers "${assignCategoryTarget.name}"`);
      } else {
        showToast(data.error || 'Erreur association.', 'error');
      }
    } catch {
      showToast('Erreur serveur.', 'error');
    }
  };

  // -------------------------------------------------------------
  // PACKS CRUD HANDLERS
  // -------------------------------------------------------------
  const handleSavePack = async (e: React.FormEvent, syncFromCatalog = false) => {
    e.preventDefault();
    if (!editingPack || !editingPack.name?.trim()) {
      showToast('Le nom du pack est obligatoire.', 'error');
      return;
    }

    try {
      const isNew = !editingPack.id;
      const url = isNew ? '/api/admin/packs' : `/api/admin/packs/${editingPack.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editingPack, syncFromCatalog }),
      });

      const data = await res.json();
      if (data.success) {
        setIsPackModalOpen(false);
        setEditingPack(null);
        await loadAllAdminData();
        showToast(isNew ? 'Nouveau pack créé avec succès !' : 'Pack mis à jour et synchronisé !');
      } else {
        showToast(data.error || 'Erreur enregistrement pack.', 'error');
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  const handleTogglePack = async (pack: SurveillancePack) => {
    try {
      const nextActive = !(pack.isActive !== false);
      const res = await fetch(`/api/admin/packs/${pack.id}/toggle`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: nextActive }),
      });
      const data = await res.json();
      if (data.success) {
        await loadAllAdminData();
        showToast(`Pack "${pack.name}" ${nextActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`);
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  const handleRecalculateAllPacks = async () => {
    try {
      const res = await fetch('/api/admin/packs/recalculate-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        await loadAllAdminData();
        showToast('Tous les packs ont été recalculés d\'après les prix actuels du catalogue !');
      }
    } catch {
      showToast('Erreur recalcul packs.', 'error');
    }
  };

  const handleDeletePack = async () => {
    if (!packToDelete) return;
    try {
      const res = await fetch(`/api/admin/packs/${packToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPackToDelete(null);
        await loadAllAdminData();
        showToast(`Pack "${packToDelete.name}" supprimé (sauvegarde effectuée).`);
      }
    } catch {
      showToast('Erreur suppression pack.', 'error');
    }
  };

  // -------------------------------------------------------------
  // ORDERS & BACKUPS HANDLERS
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, notes?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, internalNotes: notes }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (selectedOrderDetails?.id === orderId) {
          setSelectedOrderDetails(data.order);
        }
        showToast(`Commande ${data.order.orderNumber} : ${newStatus}`);
        loadAllAdminData();
      }
    } catch {
      showToast('Erreur mise à jour commande.', 'error');
    }
  };

  const handleDownloadDatabaseBackup = async () => {
    try {
      const res = await fetch('/api/admin/export-database', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        showToast('Échec du téléchargement sécurisé.', 'error');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `D_SECURE_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Sauvegarde JSON téléchargée avec succès.');
    } catch {
      showToast('Erreur lors de l\'export.', 'error');
    }
  };

  const handleCreateServerBackup = async () => {
    try {
      const res = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        await loadAllAdminData();
        showToast(`Sauvegarde serveur créée : ${data.filename}`);
      }
    } catch {
      showToast('Erreur création sauvegarde.', 'error');
    }
  };

  // -------------------------------------------------------------
  // FILTERED & PAGINATED DATA
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.topSection !== categoryFilter && p.category !== categoryFilter) {
        return false;
      }
      if (availabilityFilter === 'available' && p.isAvailable === false) return false;
      if (availabilityFilter === 'unavailable' && p.isAvailable !== false) return false;

      if (productSearch.trim()) {
        const query = productSearch.toLowerCase();
        const matchRef = (p.reference || '').toLowerCase().includes(query);
        const matchName = (p.name || '').toLowerCase().includes(query);
        const matchDesc = (p.description || '').toLowerCase().includes(query);
        if (!matchRef && !matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [products, categoryFilter, availabilityFilter, productSearch]);

  const totalProductPages = Math.max(1, Math.ceil(filteredProducts.length / productPageSize));
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * productPageSize;
    return filteredProducts.slice(start, start + productPageSize);
  }, [filteredProducts, productPage, productPageSize]);

  useEffect(() => {
    setProductPage(1);
  }, [productSearch, categoryFilter, availabilityFilter, productPageSize]);

  const filteredAvailableImages = useMemo(() => {
    if (!imageSearchQuery.trim()) return availableImages;
    const q = imageSearchQuery.toLowerCase();
    return availableImages.filter(
      (img) => img.name.toLowerCase().includes(q) || img.category.toLowerCase().includes(q)
    );
  }, [availableImages, imageSearchQuery]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const navTabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'overview', label: "Vue d'ensemble", icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'products', label: 'Matériels', icon: <Package className="w-4 h-4" />, badge: products.length },
    { id: 'availability', label: 'Disponibilité', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'prices', label: 'Prix & Références', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'categories', label: 'Catégories', icon: <FolderKanban className="w-4 h-4" />, badge: categories.length },
    { id: 'packs', label: 'Packs Vidéosurveillance', icon: <ShieldCheck className="w-4 h-4" />, badge: packs.length },
    { id: 'orders', label: 'Commandes', icon: <ShoppingCart className="w-4 h-4" />, badge: orders.length },
    { id: 'customers', label: 'Clients', icon: <Users className="w-4 h-4" />, badge: customers.length },
    { id: 'analytics', label: 'Visiteurs', icon: <TrendingUp className="w-4 h-4" />, badge: summary?.totalVisits || 0 },
    { id: 'audit', label: 'Journal & Sauvegardes', icon: <Database className="w-4 h-4" /> },
  ];

  // -------------------------------------------------------------
  // VIEW 1: SECURED LOGIN PORTAL
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 selection:bg-[#D71920] selection:text-white">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D71920] via-red-600 to-zinc-900" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-black border border-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D71920] shadow-inner">
              <Shield className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-black uppercase tracking-tight text-white font-mono">
              ESPACE ADMINISTRATEUR
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              Portail interne D SECURE &middot; Accès sécurisé aux données confidentielles
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800/80 text-red-200 rounded-xl text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{loginError}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Mot de passe administrateur
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Saisissez votre mot de passe..."
                  autoComplete="new-password"
                  autoFocus
                  required
                  className="w-full px-4 py-3 pr-11 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-[#D71920] focus:ring-1 focus:ring-[#D71920] transition-all font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <span className="text-[10px] text-zinc-500 mt-1.5 block">
                Authentification côté serveur (scrypt) &middot; Protection anti-tentatives &middot; Expiration 30 min.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>VÉRIFICATION EN COURS...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>ACCÉDER AU TABLEAU DE BORD</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-zinc-800 text-center">
            <button
              onClick={onBackToPublicSite}
              className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>&larr; Retour au site public D SECURE</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: FULL PROFESSIONAL ADMIN WORKSPACE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-700'
              : 'bg-zinc-950 text-white border-zinc-700'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
              aria-label="Menu administration"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-[#D71920] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm shrink-0">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight uppercase">D SECURE ADMIN</span>
                {storageInfo && !storageInfo.persistent ? (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full hidden sm:inline">
                    STOCKAGE TEMPORAIRE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full hidden sm:inline">
                    SYNCHRONISÉ
                  </span>
                )}
              </div>
              <span className="text-[11px] text-zinc-400 hidden sm:block">
                Portail Propriétaire &middot; Gestion Complète & Confidentialité
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Inactivité : <strong className="font-mono text-white">{formatTime(sessionTimeRemaining)}</strong>
              </span>
            </div>

            <button
              onClick={loadAllAdminData}
              disabled={isLoading}
              title="Actualiser toutes les données"
              className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onBackToPublicSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-medium text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Site Public</span>
            </button>

            <button
              onClick={() => handleLogout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 transition-colors font-bold text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Responsive Sidebar */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation (Desktop persistent / Mobile drawer) */}
        <aside
          className={`lg:w-64 shrink-0 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-3 sticky top-22 space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Navigation Interne
            </div>
            {navTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={active ? 'text-[#D71920]' : 'text-zinc-400'}>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        active ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-zinc-100 px-2">
              <button
                onClick={handleDownloadDatabaseBackup}
                className="w-full py-2 px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Sauvegarde JSON</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Panel */}
        <div className="flex-1 min-w-0 space-y-6">
          {storageInfo && !storageInfo.persistent && storageInfo.warning && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-black uppercase tracking-wide text-amber-900">
                  Configuration base de données requise sur Vercel
                </p>
                <p className="leading-relaxed">{storageInfo.warning}</p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: VUE D'ENSEMBLE (ALL REAL KPIs)                     */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950">
                  Vue d&apos;Ensemble &mdash; Activité Réelle D SECURE
                </h2>
                <p className="text-xs text-zinc-500">
                  Indicateurs calculés exclusivement à partir de la base de données du site
                </p>
              </div>

              {/* 9 Real KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                    Total Matériels
                  </span>
                  <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                    {summary?.totalCount ?? products.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Catalogue complet</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                    Disponibles
                  </span>
                  <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
                    {summary?.availableCount ?? products.filter((p) => p.isAvailable !== false).length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Actifs en stock</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">
                    Indisponibles
                  </span>
                  <span className="text-2xl font-black text-red-600 font-mono mt-1 block">
                    {summary?.unavailableCount ?? products.filter((p) => p.isAvailable === false).length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Visibles sur demande</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                    Catégories
                  </span>
                  <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                    {summary?.categoriesCount ?? categories.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    {summary?.activeCategoriesCount ?? categories.filter((c) => c.isActive !== false).length} actives
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                    Visiteurs / Visites
                  </span>
                  <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                    {summary?.uniqueVisitorsCount ?? 0} <span className="text-sm text-zinc-400">/ {summary?.totalVisits ?? 0}</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    {analytics?.todayVisits ?? 0} visites aujourd&apos;hui
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D71920] block">
                    Commandes Reçues
                  </span>
                  <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                    {summary?.ordersCount ?? orders.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Total enregistré</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                    En Attente
                  </span>
                  <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
                    {summary?.pendingOrdersCount ?? 0}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">À traiter / confirmer</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                    Commandes Traitées
                  </span>
                  <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                    {summary?.completedOrdersCount ?? 0}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Confirmées & livrées</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                    Clients Enregistrés
                  </span>
                  <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                    {summary?.customersCount ?? customers.length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Ayant passé commande</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 block">
                    Packs Actifs
                  </span>
                  <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                    {summary?.activePacksCount ?? packs.filter((p) => p.isActive !== false).length}
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block">Sur {packs.length} configurés</span>
                </div>
              </div>

              {/* Financial Confidential Card */}
              <div className="bg-zinc-950 text-white rounded-2xl p-6 border border-zinc-800 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#D71920]">
                      SYNTHÈSE FINANCIÈRE CONFIDENTIELLE (USAGE INTERNE EXCLUSIF)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Jamais exposée aux visiteurs publics &middot; Calculée sur les prix d&apos;achat et de vente réels
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded">
                    {summary?.withPriceCount ?? 0} articles chiffrés
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Valeur Catalogue Vente</span>
                    <span className="text-xl font-black font-mono text-white mt-1 block">
                      {formatAr(summary?.totalSellingValueAr)}
                    </span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Coût Achat Interne</span>
                    <span className="text-xl font-black font-mono text-zinc-300 mt-1 block">
                      {formatAr(summary?.totalPurchaseValueAr)}
                    </span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Marge Brute Potentielle</span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                      +{formatAr(summary?.grossMarginAr)}
                    </span>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-red-400 uppercase block">Taux de Marge Moyen</span>
                    <span className="text-xl font-black font-mono text-red-400 mt-1 block">
                      +{summary?.averageMarginPercent || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2">
                    Actions Rapides
                  </h4>

                  <button
                    onClick={() => {
                      setEditingProduct({
                        name: '',
                        reference: '',
                        category: 'Caméras IP',
                        topSection: 'cameras',
                        sellingPriceAr: 0,
                        isAvailable: true,
                      });
                      setIsEditProductModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter un matériel</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('prices')}
                    className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4 text-[#D71920]" />
                    <span>Modifier prix & références</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('packs')}
                    className="w-full py-2.5 px-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-red-600" />
                    <span>Gérer les packs vidéosurveillance</span>
                  </button>
                </div>

                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3 flex items-center justify-between">
                    <span>Activité Récente du Site</span>
                    <button
                      onClick={() => setActiveTab('audit')}
                      className="text-[11px] font-bold text-[#D71920] hover:underline"
                    >
                      Tout voir &rarr;
                    </button>
                  </h4>

                  <div className="divide-y divide-zinc-100 max-h-64 overflow-y-auto">
                    {auditLogs.length === 0 ? (
                      <div className="text-xs text-zinc-400 py-8 text-center">
                        Aucune modification ou commande enregistrée pour l&apos;instant.
                      </div>
                    ) : (
                      auditLogs.slice(0, 8).map((log) => (
                        <div key={log.id} className="py-2.5 flex items-start justify-between text-xs gap-3">
                          <div>
                            <span className="font-bold text-zinc-900">{log.entityName || log.entityId}</span>
                            <span className="text-zinc-500 block text-[11px]">{log.details}</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 whitespace-nowrap font-mono">
                            {new Date(log.timestamp).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: GESTION COMPLÈTE DES MATÉRIELS                     */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Rechercher par référence, nom, description..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-hidden focus:border-[#D71920]"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="all">Toutes les sections</option>
                    <option value="cameras">Caméras de Surveillance</option>
                    <option value="alarms">Systèmes d&apos;Alarme</option>
                    <option value="dvr_nvr">Enregistreurs DVR / NVR</option>
                    <option value="accessories">Accessoires & Câblage</option>
                    <option value="hdd">Disques Durs</option>
                    <option value="network">Réseau & Switchs PoE</option>
                    <option value="monitors">Moniteurs</option>
                    <option value="packs">Packs Vidéosurveillance</option>
                  </select>

                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                    className="px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="available">Disponibles</option>
                    <option value="unavailable">Indisponibles</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      reference: '',
                      category: 'Caméras IP',
                      topSection: 'cameras',
                      sellingPriceAr: 0,
                      isAvailable: true,
                    });
                    setIsEditProductModalOpen(true);
                  }}
                  className="py-2 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Matériel</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Photo</th>
                      <th className="py-2.5 px-3">Référence</th>
                      <th className="py-2.5 px-3">Désignation & Catégorie</th>
                      <th className="py-2.5 px-3 text-center">Ordre</th>
                      <th className="py-2.5 px-3 text-right">Achat (Conf.)</th>
                      <th className="py-2.5 px-3 text-right">Prix Vente</th>
                      <th className="py-2.5 px-3 text-center">Statut</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2 px-3">
                          <div
                            onClick={() => product.image && setImagePreviewUrl(product.image)}
                            className="w-11 h-11 rounded-lg bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center cursor-pointer hover:border-zinc-400 overflow-hidden"
                            title={product.image ? 'Cliquez pour agrandir' : 'Aucune image'}
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.reference}
                                className="max-h-full max-w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-zinc-300" />
                            )}
                          </div>
                        </td>

                        <td className="py-2 px-3 font-mono font-bold text-[#D71920] whitespace-nowrap">
                          {product.reference}
                        </td>

                        <td className="py-2 px-3">
                          <div className="font-semibold text-zinc-900 max-w-xs truncate" title={product.name}>
                            {product.name}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {product.category} &bull; <span className="uppercase">{product.topSection}</span>
                          </div>
                        </td>

                        <td className="py-2 px-3 text-center font-mono text-zinc-500">
                          {product.displayOrder ?? '—'}
                        </td>

                        <td className="py-2 px-3 text-right font-mono text-zinc-500 whitespace-nowrap">
                          {formatAr(product.originalPriceAr)}
                        </td>

                        <td className="py-2 px-3 text-right font-mono font-bold text-zinc-950 whitespace-nowrap">
                          {product.formattedPrice}
                        </td>

                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleToggleAvailability(product)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide transition-all ${
                              product.isAvailable !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {product.isAvailable !== false ? 'DISPONIBLE' : 'INDISPONIBLE'}
                          </button>
                        </td>

                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsEditProductModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-200 rounded-md transition-colors"
                              title="Modifier la fiche complète"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                openImagePicker(async (newImgPath) => {
                                  const res = await fetch(`/api/admin/products/${product.id}`, {
                                    method: 'PUT',
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ image: newImgPath }),
                                  });
                                  const d = await res.json();
                                  if (d.success) {
                                    await loadAllAdminData();
                                    showToast(`Image remplacée pour ${product.reference} !`);
                                  }
                                })
                              }
                              className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-zinc-200 rounded-md transition-colors"
                              title="Remplacer ou importer une photo"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setProductToDelete(product);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Supprimer avec confirmation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <span>
                    Affichage {(productPage - 1) * productPageSize + 1}&ndash;
                    {Math.min(productPage * productPageSize, filteredProducts.length)} sur {filteredProducts.length} matériels
                  </span>
                  <select
                    value={productPageSize}
                    onChange={(e) => setProductPageSize(Number(e.target.value))}
                    className="px-2 py-1 bg-zinc-50 border border-zinc-300 rounded text-xs"
                  >
                    <option value={30}>30 / page</option>
                    <option value={60}>60 / page</option>
                    <option value={300}>Tout afficher</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={productPage <= 1}
                    onClick={() => setProductPage((p) => p - 1)}
                    className="px-2.5 py-1 border border-zinc-300 rounded-lg disabled:opacity-40 hover:bg-zinc-100 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Précédent
                  </button>
                  <span className="px-2 font-mono font-bold">
                    Page {productPage} / {totalProductPages}
                  </span>
                  <button
                    disabled={productPage >= totalProductPages}
                    onClick={() => setProductPage((p) => p + 1)}
                    className="px-2.5 py-1 border border-zinc-300 rounded-lg disabled:opacity-40 hover:bg-zinc-100 flex items-center gap-1"
                  >
                    Suivant <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DISPONIBILITÉ DES MATÉRIELS                        */}
          {/* ========================================================= */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl text-xs text-zinc-800 space-y-1">
                <strong className="text-[#D71920] font-black uppercase tracking-wider block">
                  Règle de Disponibilité D SECURE (Conservation Visibilité) :
                </strong>
                <p>
                  Un matériel désactivé reste <strong>toujours visible sur le site public</strong> (avec photo, nom, référence, description),
                  mais affiche le badge rouge <strong>« INDISPONIBLE »</strong> et le bouton « SUR COMMANDE ».
                  Dès réactivation ici, il repasse instantanément à <strong>« DISPONIBLE »</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="grid grid-cols-2 gap-3 flex-1 max-w-md">
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">Disponibles</span>
                    <span className="text-lg font-black font-mono text-emerald-700">
                      {products.filter((p) => p.isAvailable !== false).length}
                    </span>
                  </div>
                  <div className="bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-red-800">Indisponibles</span>
                    <span className="text-lg font-black font-mono text-red-700">
                      {products.filter((p) => p.isAvailable === false).length}
                    </span>
                  </div>
                </div>

                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher référence ou nom..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Référence</th>
                      <th className="py-2.5 px-3">Matériel</th>
                      <th className="py-2.5 px-3">Catégorie</th>
                      <th className="py-2.5 px-3 text-center">Statut Public</th>
                      <th className="py-2.5 px-3 text-center">Basculer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#D71920]">{product.reference}</td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-900">{product.name}</td>
                        <td className="py-2.5 px-3 text-zinc-500">{product.category}</td>
                        <td className="py-2.5 px-3 text-center">
                          {product.isAvailable !== false ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> DISPONIBLE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-full">
                              <X className="w-3 h-3" /> INDISPONIBLE
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleAvailability(product)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              product.isAvailable !== false
                                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {product.isAvailable !== false ? 'Désactiver (Indisponible)' : 'Activer (Disponible)'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: GESTION DES PRIX & RÉFÉRENCES                      */}
          {/* ========================================================= */}
          {activeTab === 'prices' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                    Modification Rapide des Prix, Références & Désignations
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Les modifications sont enregistrées sur le serveur, journalisées et recalculent automatiquement les packs associés.
                  </p>
                </div>

                <div className="relative min-w-[260px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher par nom ou référence..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Référence Exacte</th>
                      <th className="py-2.5 px-3">Désignation Commerciale</th>
                      <th className="py-2.5 px-3 text-right">Achat Interne (Ar)</th>
                      <th className="py-2.5 px-3 text-right">Prix Vente Public (Ar)</th>
                      <th className="py-2.5 px-3 text-center">Marge</th>
                      <th className="py-2.5 px-3 text-center">Enregistrer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {paginatedProducts.map((product) => (
                      <PriceRefRow
                        key={product.id}
                        product={product}
                        onSave={handleInlinePriceRefSave}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-600 pt-1">
                <span>
                  Page {productPage} / {totalProductPages} ({filteredProducts.length} résultats)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={productPage <= 1}
                    onClick={() => setProductPage((p) => p - 1)}
                    className="px-3 py-1 border border-zinc-300 rounded-lg disabled:opacity-40"
                  >
                    Précédent
                  </button>
                  <button
                    disabled={productPage >= totalProductPages}
                    onClick={() => setProductPage((p) => p + 1)}
                    className="px-3 py-1 border border-zinc-300 rounded-lg disabled:opacity-40"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: GESTION COMPLÈTE DES CATÉGORIES                    */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                    Gestion des Catégories & Attribution des Matériels
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Ajoutez, modifiez, réordonnez ou désactivez des catégories et déplacez des matériels sans jamais les supprimer.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategory({
                      name: '',
                      topSection: 'accessories',
                      description: '',
                      image: '',
                      order: categories.length + 1,
                      isActive: true,
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="py-2 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une catégorie</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      cat.isActive !== false ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-100/70 border-zinc-300 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-11 rounded-lg bg-white border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <Layers className="w-5 h-5 text-zinc-300" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#D71920] tracking-wider font-mono block">
                              Position #{cat.order} &bull; {cat.topSection}
                            </span>
                            <h4 className="font-extrabold text-sm text-zinc-900 leading-tight">{cat.name}</h4>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold bg-white border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded shrink-0">
                          {cat.productCount} prod.
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-2">
                        {cat.description || 'Catégorie officielle du catalogue D SECURE.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span
                        className={`font-bold flex items-center gap-1 text-[11px] ${
                          cat.isActive !== false ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {cat.isActive !== false ? 'Active' : 'Désactivée'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setAssignCategoryTarget(cat);
                            setSelectedProductIdsForAssign([]);
                            setAssignSearch('');
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-zinc-100 border border-zinc-300 rounded-md text-[11px] font-bold text-zinc-700"
                        >
                          Associer matériels
                        </button>

                        <button
                          onClick={() => {
                            setEditingCategory({ ...cat, renameProductsCategory: true });
                            setIsCategoryModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-black text-white rounded-md text-[11px] font-bold"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: GESTION DES PACKS VIDÉOSURVEILLANCE                */}
          {/* ========================================================= */}
          {activeTab === 'packs' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                    Gestion des Packs Vidéosurveillance ({packs.length} packs)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Séparation stricte Analogique / IP Numérique PoE &middot; Calcul automatique depuis les prix du catalogue
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleRecalculateAllPacks}
                    className="py-2 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>Recalculer les prix (BOM)</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingPack({
                        family: 'analog',
                        subFamily: 'analog-exir',
                        subFamilyLabel: 'Analogique EXIR',
                        name: 'NOUVEAU PACK SUR-MESURE',
                        tagline: 'Solution complète prête à installer',
                        badge: 'Nouveau Pack',
                        technology: 'Analogique Turbo HD (Coaxial)',
                        camerasCount: 4,
                        resolution: 'Full HD 1080p',
                        nightVision: 'Infrarouge EXIR 20m',
                        cameraModel: '',
                        recorderModel: '',
                        storage: 'Disque dur 500 Go',
                        cabling: '1 Rouleau câble coaxial 100m',
                        powerSupply: 'Bloc alimentation C4',
                        image: '/images/packs/pack_analog_exir_4.jpg',
                        highlights: ['Installation offerte à Antananarivo'],
                        bom: [
                          {
                            ref: 'INST-TANA-OFFERTE',
                            name: 'Pose et paramétrage application mobile',
                            category: 'Services techniques',
                            role: 'Installation professionnelle à Antananarivo',
                            quantity: 1,
                            unitPriceAr: 0,
                            totalPriceAr: 0,
                            isOffered: true,
                          },
                        ],
                        isActive: true,
                        installationIncluded: true,
                      });
                      setIsPackModalOpen(true);
                    }}
                    className="py-2 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau Pack</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {packs.map((pack) => (
                  <div
                    key={pack.id}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      pack.isActive !== false ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-100 border-zinc-300 opacity-70'
                    }`}
                  >
                    <div>
                      <div className="aspect-16/10 bg-white rounded-lg border border-zinc-200 p-2 flex items-center justify-center overflow-hidden mb-3 relative">
                        <img
                          src={pack.image}
                          alt={pack.name}
                          className="max-h-full max-w-full object-contain"
                        />
                        <span
                          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                            pack.isActive !== false
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-600 text-white'
                          }`}
                        >
                          {pack.isActive !== false ? 'ACTIF' : 'DÉSACTIVÉ'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded text-white ${
                            pack.family === 'ip' ? 'bg-[#D71920]' : 'bg-zinc-900'
                          }`}
                        >
                          {pack.family === 'ip' ? 'IP NUMÉRIQUE PoE' : 'ANALOGIQUE TURBO HD'}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 font-mono">
                          {pack.camerasCount} Cams
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-zinc-900 leading-snug">{pack.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{pack.tagline}</p>

                      <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-zinc-200 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Nomenclature BOM :</span>
                          <span className="font-bold text-zinc-800">{pack.bom.length} lignes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Total Calculé :</span>
                          <span className="font-mono font-black text-[#D71920]">{pack.formattedPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTogglePack(pack)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
                          pack.isActive !== false
                            ? 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {pack.isActive !== false ? 'Désactiver' : 'Activer'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingPack(JSON.parse(JSON.stringify(pack)));
                            setIsPackModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Éditer BOM</span>
                        </button>
                        <button
                          onClick={() => setPackToDelete(pack)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg"
                          title="Supprimer ce pack"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: HISTORIQUE DES COMMANDES CLIENTS                   */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                    Historique Réel des Commandes ({orders.length})
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Uniquement les commandes réellement validées par vos clients sur le site D SECURE
                  </p>
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Nouvelle commande">Nouvelle commande</option>
                  <option value="En attente de confirmation">En attente de confirmation</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-500 text-xs">
                  <ShoppingCart className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                  <strong className="text-zinc-800 text-sm block">Aucune commande enregistrée pour l&apos;instant</strong>
                  <p className="mt-1 max-w-md mx-auto">
                    Les commandes passées via le panier, la commande directe produit ou les packs apparaîtront automatiquement ici. Aucune commande fictive n&apos;est générée.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">N° Commande</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Client & Adresse</th>
                        <th className="py-2.5 px-3">Téléphone / WhatsApp</th>
                        <th className="py-2.5 px-3">Articles</th>
                        <th className="py-2.5 px-3 text-right">Montant Total</th>
                        <th className="py-2.5 px-3 text-center">Statut</th>
                        <th className="py-2.5 px-3 text-center">Détails</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {orders
                        .filter((o) => (orderStatusFilter === 'all' ? true : o.status === orderStatusFilter))
                        .map((order) => (
                          <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#D71920]">
                              {order.orderNumber}
                            </td>
                            <td className="py-2.5 px-3 text-zinc-500 font-mono whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-zinc-900">{order.customer.fullName}</div>
                              <div className="text-[10px] text-zinc-500">{order.customer.address}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-zinc-700">{order.customer.phone}</td>
                            <td className="py-2.5 px-3 text-zinc-600">
                              {order.items.reduce((s, it) => s + it.quantity, 0)} art.
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950">
                              {order.formattedTotal}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="text-[11px] font-bold py-1 px-2 rounded-lg bg-zinc-50 border border-zinc-200 cursor-pointer"
                              >
                                <option value="Nouvelle commande">Nouvelle commande</option>
                                <option value="En attente de confirmation">En attente de confirmation</option>
                                <option value="Confirmée">Confirmée</option>
                                <option value="En préparation">En préparation</option>
                                <option value="Livrée">Livrée</option>
                                <option value="Annulée">Annulée</option>
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => {
                                  setSelectedOrderDetails(order);
                                  setOrderNotesInput(order.internalNotes || '');
                                }}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold rounded-md"
                              >
                                Ouvrir
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: GESTION DES CLIENTS                                */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Base Clients Confidentielle ({customers.length})
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Accessible exclusivement après authentification administrateur &middot; Données issues uniquement des commandes réelles
                </p>
              </div>

              {customers.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-500 text-xs">
                  <Users className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                  <strong className="text-zinc-800 text-sm block">Aucun client enregistré</strong>
                  <p className="mt-1">Les fiches clients sont créées automatiquement dès réception d&apos;une commande réelle.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">Téléphone / WhatsApp</th>
                        <th className="py-2.5 px-3">Adresse fournie</th>
                        <th className="py-2.5 px-3 text-center">Commandes</th>
                        <th className="py-2.5 px-3 text-right">Volume Total</th>
                        <th className="py-2.5 px-3">Dernière Commande</th>
                        <th className="py-2.5 px-3 text-center">Historique</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-zinc-900">{c.fullName}</td>
                          <td className="py-2.5 px-3 font-mono text-zinc-700">{c.phone}</td>
                          <td className="py-2.5 px-3 text-zinc-600">{c.address}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-[#D71920]">
                            {c.totalOrders}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950">
                            {c.formattedTotalSpent}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-500 font-mono">
                            {new Date(c.lastOrderAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => setSelectedCustomerDetails(c)}
                              className="px-2.5 py-1 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold rounded-md"
                            >
                              Voir ({c.totalOrders})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: SUIVI DES VISITEURS DU SITE                        */}
          {/* ========================================================= */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Statistiques Réelles de Fréquentation (Anonymisées)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Comptage anonyme par hachage journalier sans stockage d&apos;adresse IP ni données personnelles
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Visiteurs Uniques</span>
                  <span className="text-3xl font-black font-mono text-zinc-900 mt-1 block">
                    {analytics?.uniqueVisitorsCount ?? 0}
                  </span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Visites Totales (Vues)</span>
                  <span className="text-3xl font-black font-mono text-zinc-900 mt-1 block">
                    {analytics?.totalVisits ?? 0}
                  </span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Visites Aujourd&apos;hui</span>
                  <span className="text-3xl font-black font-mono text-emerald-600 mt-1 block">
                    {analytics?.todayVisits ?? 0}
                  </span>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <span className="text-[10px] font-bold text-[#D71920] uppercase block">Dernière Activité</span>
                  <span className="text-sm font-bold font-mono text-zinc-700 mt-2 block">
                    {analytics?.lastVisitedAt
                      ? new Date(analytics.lastVisitedAt).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'En attente'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pages les plus consultées */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3">
                    Pages les Plus Consultées
                  </h4>
                  <div className="space-y-2 text-xs">
                    {analytics && Object.keys(analytics.pageViews).length > 0 ? (
                      Object.entries(analytics.pageViews)
                        .sort((a, b) => b[1] - a[1])
                        .map(([page, count]) => (
                          <div key={page} className="flex justify-between items-center py-1.5 border-b border-zinc-200/60">
                            <span className="font-mono text-zinc-800">{page}</span>
                            <span className="font-mono font-bold text-[#D71920]">{count} vue(s)</span>
                          </div>
                        ))
                    ) : (
                      <div className="text-zinc-400 py-4 text-center">Aucune visite de page enregistrée.</div>
                    )}
                  </div>
                </div>

                {/* Catégories les plus consultées */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3">
                    Catégories les Plus Consultées
                  </h4>
                  <div className="space-y-2 text-xs">
                    {analytics && analytics.categoryViews && Object.keys(analytics.categoryViews).length > 0 ? (
                      Object.entries(analytics.categoryViews)
                        .sort((a, b) => b[1] - a[1])
                        .map(([cat, count]) => (
                          <div key={cat} className="flex justify-between items-center py-1.5 border-b border-zinc-200/60">
                            <span className="font-bold uppercase text-zinc-800">{cat}</span>
                            <span className="font-mono font-bold text-zinc-900">{count} vue(s)</span>
                          </div>
                        ))
                    ) : (
                      <div className="text-zinc-400 py-4 text-center">Aucune consultation de catégorie enregistrée.</div>
                    )}
                  </div>
                </div>

                {/* Produits les plus consultés */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3">
                    Produits les Plus Consultés
                  </h4>
                  <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
                    {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                      analytics.topProducts.map((tp: any) => (
                        <div key={tp.productId} className="flex justify-between items-center py-1.5 border-b border-zinc-200/60 gap-2">
                          <div className="truncate">
                            <span className="font-mono font-bold text-[#D71920]">{tp.reference}</span>
                            <span className="text-zinc-600 block text-[11px] truncate">{tp.name}</span>
                          </div>
                          <span className="font-mono font-bold text-zinc-900 shrink-0">{tp.views} vue(s)</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-400 py-4 text-center">Aucune fiche produit ouverte pour l&apos;instant.</div>
                    )}
                  </div>
                </div>

                {/* Évolution quotidienne & mensuelle */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-4">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2">
                      Évolution Quotidienne
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {analytics?.dailyVisits?.slice(-7).map((day) => (
                        <div key={day.date} className="flex justify-between items-center py-1 border-b border-zinc-200/60">
                          <span className="font-mono text-zinc-700">{day.date}</span>
                          <span className="font-mono font-bold text-zinc-900">{day.visits} visite(s)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2">
                      Évolution Mensuelle
                    </h4>
                    <div className="space-y-1.5 text-xs">
                      {analytics?.monthlyVisits?.slice(-6).map((m) => (
                        <div key={m.month} className="flex justify-between items-center py-1 border-b border-zinc-200/60">
                          <span className="font-mono text-zinc-700">{m.month}</span>
                          <span className="font-mono font-bold text-[#D71920]">{m.visits} visite(s)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: JOURNAL D'AUDIT & SAUVEGARDES                     */}
          {/* ========================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                      Sauvegardes & Journal d&apos;Audit Administratif
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Historique horodaté des modifications (prix, références, catégories, statuts) sans jamais stocker de mot de passe.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCreateServerBackup}
                      className="py-2 px-3.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Instantanné Serveur</span>
                    </button>

                    <button
                      onClick={handleDownloadDatabaseBackup}
                      className="py-2 px-3.5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger JSON</span>
                    </button>
                  </div>
                </div>

                {serverBackups.length > 0 && (
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                    <span className="font-bold text-zinc-700 uppercase text-[10px] block mb-2">
                      Derniers instantanés serveur automatiques/manuels ({serverBackups.length}) :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {serverBackups.slice(0, 6).map((b) => (
                        <span key={b.name} className="px-2.5 py-1 bg-white border border-zinc-200 rounded font-mono text-[11px] text-zinc-700">
                          {b.name} ({b.sizeFormatted})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Date & Heure</th>
                        <th className="py-2.5 px-3">Opération</th>
                        <th className="py-2.5 px-3">Élément</th>
                        <th className="py-2.5 px-3">Détails</th>
                        <th className="py-2.5 px-3">Auteur</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-zinc-400">
                            Aucune entrée dans le journal.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-zinc-500 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString('fr-FR')}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#D71920]">{log.action}</td>
                            <td className="py-2.5 px-3 font-semibold text-zinc-900">
                              {log.entityName || log.entityId}
                            </td>
                            <td className="py-2.5 px-3 text-zinc-700">{log.details}</td>
                            <td className="py-2.5 px-3 text-zinc-500">{log.user}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT (With Display Order & Image)     */}
      {/* ========================================================= */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <h3 className="text-base font-black uppercase text-zinc-900 tracking-tight">
                {editingProduct.id ? 'Modifier le Matériel' : 'Ajouter un Nouveau Matériel'}
              </h3>
              <button
                onClick={() => {
                  setIsEditProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-zinc-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Référence Exacte *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.reference || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, reference: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono font-bold text-[#D71920]"
                    placeholder="ex: DS-2CE16D0T-EXIPF"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Nom / Désignation *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                    placeholder="ex: Caméra Bullet Turbo HD 2MP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Section Principale</label>
                  <select
                    value={editingProduct.topSection || 'cameras'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, topSection: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                  >
                    <option value="cameras">Caméras de Surveillance</option>
                    <option value="alarms">Systèmes d&apos;Alarme</option>
                    <option value="dvr_nvr">Enregistreurs DVR / NVR</option>
                    <option value="accessories">Accessoires & Câblage</option>
                    <option value="hdd">Disques Durs</option>
                    <option value="network">Réseau & Switchs PoE</option>
                    <option value="monitors">Moniteurs</option>
                    <option value="packs">Kits & Packs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Sous-Catégorie</label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                    placeholder="ex: Caméras IP"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Ordre d&apos;affichage</label>
                  <input
                    type="number"
                    value={editingProduct.displayOrder ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        displayOrder: e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                    placeholder="ex: 1, 2, 3..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Prix d&apos;Achat (Confidentiel Ar)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPriceAr ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPriceAr: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Prix de Vente Public (Ar)</label>
                  <input
                    type="number"
                    value={editingProduct.sellingPriceAr ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sellingPriceAr: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono font-bold text-zinc-950"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Description & Spécifications</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Photographie du Matériel</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Aperçu" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-xs"
                      placeholder="/images/... (laisser inchangé pour conserver l'originale)"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openImagePicker((path) =>
                          setEditingProduct((prev) => (prev ? { ...prev, image: path } : prev))
                        )
                      }
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D71920]" />
                      <span>Importer ou Choisir une Photographie</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prod-available"
                  checked={editingProduct.isAvailable !== false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                  className="w-4 h-4 text-[#D71920] rounded"
                />
                <label htmlFor="prod-available" className="font-bold text-zinc-800 cursor-pointer">
                  Matériel disponible en stock (Statut public : DISPONIBLE)
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-100 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold rounded-lg uppercase tracking-wide flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CATEGORY                                */}
      {/* ========================================================= */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-5">
              <h3 className="text-base font-black uppercase text-zinc-900">
                {editingCategory.id ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Nom de la Catégorie *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Section Technique</label>
                  <select
                    value={editingCategory.topSection || 'accessories'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, topSection: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                  >
                    <option value="cameras">cameras</option>
                    <option value="alarms">alarms</option>
                    <option value="packs">packs</option>
                    <option value="dvr_nvr">dvr_nvr</option>
                    <option value="accessories">accessories</option>
                    <option value="hdd">hdd</option>
                    <option value="network">network</option>
                    <option value="monitors">monitors</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Position d&apos;affichage</label>
                  <input
                    type="number"
                    value={editingCategory.order ?? 1}
                    onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Image de la Catégorie</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCategory.image || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                    placeholder="/images/..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openImagePicker((path) =>
                        setEditingCategory((prev) => (prev ? { ...prev, image: path } : prev))
                      )
                    }
                    className="px-3 py-2 bg-zinc-900 text-white rounded-lg font-bold"
                  >
                    Choisir
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 font-bold text-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive !== false}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                  />
                  <span>Catégorie active sur le site</span>
                </label>

                {editingCategory.id && (
                  <label className="flex items-center gap-2 font-medium text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.renameProductsCategory !== false}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, renameProductsCategory: e.target.checked })
                      }
                    />
                    <span>Mettre à jour le libellé sur les produits associés (sans suppression)</span>
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] text-white rounded-lg font-bold uppercase"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ASSIGN / MOVE PRODUCTS TO CATEGORY                 */}
      {/* ========================================================= */}
      {assignCategoryTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <h3 className="text-base font-black uppercase text-zinc-900">
                  Associer des matériels &rarr; {assignCategoryTarget.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  Déplacez des équipements existants vers cette catégorie sans perte de données
                </p>
              </div>
              <button onClick={() => setAssignCategoryTarget(null)} className="text-zinc-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-3 relative">
              <input
                type="text"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                placeholder="Filtrer les matériels par référence ou nom..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex-1 overflow-y-auto border border-zinc-200 rounded-xl divide-y divide-zinc-100 text-xs">
              {products
                .filter((p) => {
                  if (!assignSearch.trim()) return true;
                  const q = assignSearch.toLowerCase();
                  return p.reference.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
                })
                .slice(0, 80)
                .map((p) => {
                  const checked = selectedProductIdsForAssign.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className="flex items-center justify-between p-2.5 hover:bg-zinc-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedProductIdsForAssign((prev) =>
                              checked ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                            );
                          }}
                        />
                        <div>
                          <span className="font-mono font-bold text-[#D71920]">{p.reference}</span>
                          <span className="text-zinc-700 ml-2">{p.name}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400">{p.category}</span>
                    </label>
                  );
                })}
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-200 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-600">
                {selectedProductIdsForAssign.length} matériel(s) sélectionné(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setAssignCategoryTarget(null)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  disabled={selectedProductIdsForAssign.length === 0}
                  onClick={handleAssignProductsToCategory}
                  className="px-4 py-2 bg-[#D71920] text-white rounded-lg text-xs font-bold uppercase disabled:opacity-40"
                >
                  Appliquer l&apos;association
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PACK WITH BOM EDITOR                    */}
      {/* ========================================================= */}
      {isPackModalOpen && editingPack && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-zinc-200 my-8 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <h3 className="text-base font-black uppercase text-zinc-900">
                  {editingPack.id ? `Modifier Pack : ${editingPack.name}` : 'Créer un Nouveau Pack Vidéosurveillance'}
                </h3>
                <p className="text-xs text-zinc-500">
                  Séparation stricte Analogique / IP Numérique PoE contrôlée automatiquement
                </p>
              </div>
              <button onClick={() => setIsPackModalOpen(false)} className="text-zinc-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => handleSavePack(e, false)}
              className="flex-1 overflow-y-auto space-y-4 text-xs pr-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Nom Commercial du Pack *</label>
                  <input
                    type="text"
                    required
                    value={editingPack.name || ''}
                    onChange={(e) => setEditingPack({ ...editingPack, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Famille Technologique *</label>
                  <select
                    value={editingPack.family || 'analog'}
                    onChange={(e) => {
                      const fam = e.target.value as 'analog' | 'ip';
                      setEditingPack({
                        ...editingPack,
                        family: fam,
                        subFamily: fam === 'ip' ? 'ip-poe' : 'analog-exir',
                        technology: fam === 'ip' ? 'IP Numérique PoE (Câble Ethernet RJ45)' : 'Analogique Turbo HD (Coaxial)',
                      });
                    }}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-bold"
                  >
                    <option value="analog">ANALOGIQUE (Turbo HD)</option>
                    <option value="ip">IP NUMÉRIQUE (PoE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Gamme</label>
                  <select
                    value={editingPack.subFamily || 'analog-exir'}
                    onChange={(e) => setEditingPack({ ...editingPack, subFamily: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                  >
                    {editingPack.family === 'ip' ? (
                      <>
                        <option value="ip-poe">IP PoE 2MP AcuSense</option>
                        <option value="ip-pro">IP PoE 4MP Ultra HD</option>
                      </>
                    ) : (
                      <>
                        <option value="analog-exir">Analogique EXIR</option>
                        <option value="analog-colorvu">Smart ColorVu</option>
                        <option value="analog-hybrid">Smart Hybrid Light</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Nombre de Caméras</label>
                  <input
                    type="number"
                    value={editingPack.camerasCount || 4}
                    onChange={(e) => setEditingPack({ ...editingPack, camerasCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">Badge Commercial</label>
                  <input
                    type="text"
                    value={editingPack.badge || ''}
                    onChange={(e) => setEditingPack({ ...editingPack, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Image Commerciale du Pack</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 bg-zinc-50 border border-zinc-200 rounded-lg p-1 flex items-center justify-center shrink-0">
                    {editingPack.image ? (
                      <img src={editingPack.image} alt="Pack" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-zinc-300" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingPack.image || ''}
                    onChange={(e) => setEditingPack({ ...editingPack, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openImagePicker((path) =>
                        setEditingPack((prev) => (prev ? { ...prev, image: path } : prev))
                      )
                    }
                    className="px-3 py-2 bg-zinc-900 text-white rounded-lg font-bold"
                  >
                    Choisir / Importer
                  </button>
                </div>
              </div>

              {/* BOM Editor Table */}
              <div className="border border-zinc-200 rounded-xl p-3 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase text-zinc-900">
                    Nomenclature Technique (BOM) & Composants
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentBom = editingPack.bom || [];
                      setEditingPack({
                        ...editingPack,
                        bom: [
                          ...currentBom,
                          {
                            ref: '',
                            name: '',
                            category: 'Équipement',
                            role: 'Composant pack',
                            quantity: 1,
                            unitPriceAr: 0,
                            totalPriceAr: 0,
                          },
                        ],
                      });
                    }}
                    className="px-2.5 py-1 bg-zinc-900 text-white rounded-md font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Ajouter ligne BOM
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingPack.bom || []).map((item: PackComponentBOM, idx: number) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-zinc-200"
                    >
                      <input
                        type="text"
                        value={item.ref}
                        onChange={(e) => {
                          const next = [...(editingPack.bom || [])];
                          next[idx] = { ...next[idx], ref: e.target.value };
                          setEditingPack({ ...editingPack, bom: next });
                        }}
                        placeholder="Référence"
                        className="col-span-3 px-2 py-1 border border-zinc-300 rounded font-mono text-[11px]"
                      />
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const next = [...(editingPack.bom || [])];
                          next[idx] = { ...next[idx], name: e.target.value };
                          setEditingPack({ ...editingPack, bom: next });
                        }}
                        placeholder="Désignation"
                        className="col-span-4 px-2 py-1 border border-zinc-300 rounded text-[11px]"
                      />
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = Number(e.target.value) || 1;
                          const next = [...(editingPack.bom || [])];
                          next[idx] = {
                            ...next[idx],
                            quantity: qty,
                            totalPriceAr: next[idx].isOffered ? 0 : qty * next[idx].unitPriceAr,
                          };
                          setEditingPack({ ...editingPack, bom: next });
                        }}
                        className="col-span-1 px-2 py-1 border border-zinc-300 rounded font-mono text-center text-[11px]"
                      />
                      <input
                        type="number"
                        value={item.unitPriceAr}
                        disabled={Boolean(item.isOffered)}
                        onChange={(e) => {
                          const up = Number(e.target.value) || 0;
                          const next = [...(editingPack.bom || [])];
                          next[idx] = {
                            ...next[idx],
                            unitPriceAr: up,
                            totalPriceAr: next[idx].isOffered ? 0 : next[idx].quantity * up,
                          };
                          setEditingPack({ ...editingPack, bom: next });
                        }}
                        className="col-span-2 px-2 py-1 border border-zinc-300 rounded font-mono text-right text-[11px]"
                      />
                      <div className="col-span-2 flex items-center justify-between pl-1">
                        <span className="font-mono font-bold text-[11px]">
                          {item.isOffered ? 'OFFERT' : formatAr(item.quantity * item.unitPriceAr)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = (editingPack.bom || []).filter((_, i) => i !== idx);
                            setEditingPack({ ...editingPack, bom: next });
                          }}
                          className="text-zinc-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                  <label className="flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPack.isActive !== false}
                      onChange={(e) => setEditingPack({ ...editingPack, isActive: e.target.checked })}
                    />
                    <span>Pack actif sur le site public</span>
                  </label>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total BOM Calculé</span>
                    <span className="text-lg font-black font-mono text-[#D71920]">
                      {formatAr(
                        (editingPack.bom || []).reduce(
                          (s, it) => s + (it.isOffered ? 0 : (Number(it.unitPriceAr) || 0) * (Number(it.quantity) || 1)),
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-200 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPackModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg font-bold"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSavePack(e as any, true)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-black text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Synchroniser prix catalogue & Enregistrer</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white rounded-lg font-bold uppercase flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer tel quel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATIONS (Product / Pack)              */}
      {/* ========================================================= */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-center text-base font-black uppercase text-zinc-900">Confirmer la suppression</h3>
            <p className="text-center text-xs text-zinc-600 mt-2">
              Une sauvegarde automatique sera créée avant de supprimer :
            </p>
            <div className="my-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center font-mono text-xs font-bold text-red-600">
              {productToDelete.reference} &bull; {productToDelete.name}
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-zinc-300 rounded-lg text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {packToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200">
            <h3 className="text-center text-base font-black uppercase text-zinc-900">Supprimer ce pack ?</h3>
            <p className="text-center text-xs text-zinc-600 mt-2 font-bold">{packToDelete.name}</p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setPackToDelete(null)}
                className="flex-1 py-2.5 border border-zinc-300 rounded-lg text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleDeletePack}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-bold uppercase"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: IMAGE UPLOAD & GALLERY PICKER (With Preview!)      */}
      {/* ========================================================= */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <h3 className="text-base font-black uppercase text-zinc-900 tracking-tight">
                  Importer ou Choisir une Photographie ({availableImages.length} disponibles)
                </h3>
                <p className="text-xs text-zinc-500">
                  Importez un fichier avec prévisualisation ou sélectionnez une photo authentique du dépôt
                </p>
              </div>
              <button
                onClick={() => {
                  setIsImagePickerOpen(false);
                  setPendingUploadPreview(null);
                }}
                className="text-zinc-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload New Image Area with Preview before validation */}
            <div className="mb-4 p-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
              {!pendingUploadPreview ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Upload className="w-5 h-5 text-[#D71920]" />
                    <div>
                      <strong className="text-zinc-900 block">Ajouter une nouvelle photographie</strong>
                      <span className="text-zinc-500">Formats acceptés : JPG, PNG, WEBP (max 5 Mo)</span>
                    </div>
                  </div>
                  <label className="px-4 py-2 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold uppercase rounded-lg cursor-pointer transition-colors">
                    <span>Sélectionner un fichier</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelectForUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-white rounded-lg border border-zinc-200 p-1 flex items-center justify-center">
                      <img
                        src={pendingUploadPreview.dataBase64}
                        alt="Prévisualisation"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Prévisualisation avant validation
                      </span>
                      <strong className="block text-zinc-900 mt-1">{pendingUploadPreview.filename}</strong>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPendingUploadPreview(null)}
                      className="px-3 py-2 border border-zinc-300 rounded-lg font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={handleConfirmImageUpload}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase rounded-lg"
                    >
                      {isUploadingImage ? 'Envoi...' : 'Valider et Utiliser'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Existing Gallery */}
            <div className="mb-3 relative">
              <input
                type="text"
                value={imageSearchQuery}
                onChange={(e) => setImageSearchQuery(e.target.value)}
                placeholder="Filtrer les photos existantes par référence..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-1">
              {filteredAvailableImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (imagePickerCallback) {
                      imagePickerCallback(img.path);
                    }
                    setIsImagePickerOpen(false);
                  }}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-2 flex flex-col items-center justify-between cursor-pointer hover:border-[#D71920] hover:shadow-md transition-all group"
                >
                  <div className="aspect-square w-full flex items-center justify-center p-1 overflow-hidden relative">
                    <img
                      src={img.path}
                      alt={img.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                    {img.usedBy && img.usedBy.length > 0 && (
                      <span
                        title={`Déjà utilisée par : ${img.usedBy.join(', ')}`}
                        className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded"
                      >
                        {img.usedBy.length}x
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-zinc-700 truncate w-full text-center mt-1">
                    {img.name.replace(/\.[^/.]+$/, '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER DETAILS & NOTES                              */}
      {/* ========================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#D71920]">
                  COMMANDE {selectedOrderDetails.orderNumber}
                </span>
                <h3 className="text-base font-black uppercase text-zinc-900">Détail Complet</h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-zinc-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Client</span>
                  <span className="font-bold text-zinc-900">{selectedOrderDetails.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Téléphone / WhatsApp</span>
                  <span className="font-mono font-bold text-zinc-900">{selectedOrderDetails.customer.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Adresse</span>
                  <span className="text-zinc-700">{selectedOrderDetails.customer.address}</span>
                </div>
                {selectedOrderDetails.customer.note && (
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Note Client</span>
                    <span className="text-zinc-600 italic">&ldquo;{selectedOrderDetails.customer.note}&rdquo;</span>
                  </div>
                )}
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold uppercase text-zinc-500">
                    <tr>
                      <th className="py-2 px-3">Qté</th>
                      <th className="py-2 px-3">Référence</th>
                      <th className="py-2 px-3">Désignation</th>
                      <th className="py-2 px-3 text-right">P.U.</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {selectedOrderDetails.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-mono font-bold text-[#D71920]">{it.quantity}x</td>
                        <td className="py-2 px-3 font-mono font-bold text-zinc-800">{it.reference}</td>
                        <td className="py-2 px-3 font-semibold text-zinc-800">{it.name}</td>
                        <td className="py-2 px-3 text-right font-mono text-zinc-600">{formatAr(it.unitPriceAr)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-zinc-950">{formatAr(it.totalPriceAr)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">Notes internes D SECURE</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orderNotesInput}
                    onChange={(e) => setOrderNotesInput(e.target.value)}
                    placeholder="Suivi livraison, technicien assigné..."
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                  />
                  <button
                    onClick={() =>
                      handleUpdateOrderStatus(selectedOrderDetails.id, selectedOrderDetails.status, orderNotesInput)
                    }
                    className="px-3 py-2 bg-zinc-900 text-white rounded-lg font-bold"
                  >
                    Enregistrer note
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-zinc-950 text-white rounded-xl">
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value as OrderStatus, orderNotesInput)
                  }
                  className="bg-zinc-900 text-white border border-zinc-700 rounded-lg px-3 py-1.5 font-bold"
                >
                  <option value="Nouvelle commande">Nouvelle commande</option>
                  <option value="En attente de confirmation">En attente de confirmation</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Commande</span>
                  <span className="text-lg font-black font-mono text-white">{selectedOrderDetails.formattedTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CUSTOMER ORDER HISTORY                             */}
      {/* ========================================================= */}
      {selectedCustomerDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
              <div>
                <h3 className="text-base font-black uppercase text-zinc-900">
                  {selectedCustomerDetails.fullName}
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  {selectedCustomerDetails.phone} &bull; {selectedCustomerDetails.address}
                </p>
              </div>
              <button onClick={() => setSelectedCustomerDetails(null)} className="text-zinc-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
              {(selectedCustomerDetails.orders || []).map((ord) => (
                <div key={ord.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#D71920]">{ord.orderNumber}</span>
                    <span className="text-zinc-500 ml-2">
                      {new Date(ord.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="block text-[11px] text-zinc-700 mt-0.5">
                      {ord.items.map((i) => `${i.quantity}x ${i.reference}`).join(', ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold block">{ord.formattedTotal}</span>
                    <span className="text-[10px] font-bold text-zinc-600">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: IMAGE FULL PREVIEW                                 */}
      {/* ========================================================= */}
      {imagePreviewUrl && (
        <div
          onClick={() => setImagePreviewUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl p-4 overflow-hidden border border-zinc-200">
            <img
              src={imagePreviewUrl}
              alt="Prévisualisation"
              className="max-h-[75vh] max-w-full object-contain mx-auto"
            />
            <button
              onClick={() => setImagePreviewUrl(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline editing row for Prices & References tab
interface PriceRefRowProps {
  product: AdminProduct;
  onSave: (
    id: string,
    updates: { reference: string; name: string; sellingPriceAr: number | null; originalPriceAr: number | null }
  ) => void;
}

const PriceRefRow: React.FC<PriceRefRowProps> = ({ product, onSave }) => {
  const [refVal, setRefVal] = useState(product.reference);
  const [nameVal, setNameVal] = useState(product.name);
  const [sellVal, setSellVal] = useState<string>(product.sellingPriceAr ? String(product.sellingPriceAr) : '');
  const [buyVal, setBuyVal] = useState<string>(product.originalPriceAr ? String(product.originalPriceAr) : '');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setRefVal(product.reference);
    setNameVal(product.name);
    setSellVal(product.sellingPriceAr ? String(product.sellingPriceAr) : '');
    setBuyVal(product.originalPriceAr ? String(product.originalPriceAr) : '');
    setDirty(false);
  }, [product]);

  const parsedSell = sellVal ? Number(sellVal) : null;
  const parsedBuy = buyVal ? Number(buyVal) : null;
  const marginPct =
    parsedSell && parsedBuy && parsedBuy > 0
      ? Math.round(((parsedSell - parsedBuy) / parsedBuy) * 100)
      : null;

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="py-2 px-2.5">
        <input
          type="text"
          value={refVal}
          onChange={(e) => {
            setRefVal(e.target.value);
            setDirty(true);
          }}
          className="w-44 px-2 py-1 font-mono text-xs font-bold text-[#D71920] border border-zinc-300 rounded focus:border-[#D71920] focus:outline-hidden"
        />
      </td>
      <td className="py-2 px-2.5">
        <input
          type="text"
          value={nameVal}
          onChange={(e) => {
            setNameVal(e.target.value);
            setDirty(true);
          }}
          className="w-full min-w-[200px] px-2 py-1 text-xs font-semibold text-zinc-900 border border-zinc-300 rounded focus:border-[#D71920] focus:outline-hidden"
        />
      </td>
      <td className="py-2 px-2.5 text-right">
        <input
          type="number"
          value={buyVal}
          onChange={(e) => {
            setBuyVal(e.target.value);
            setDirty(true);
          }}
          placeholder="—"
          className="w-28 px-2 py-1 text-right font-mono text-xs border border-zinc-300 rounded focus:border-[#D71920] focus:outline-hidden"
        />
      </td>
      <td className="py-2 px-2.5 text-right">
        <input
          type="number"
          value={sellVal}
          onChange={(e) => {
            setSellVal(e.target.value);
            setDirty(true);
          }}
          placeholder="Sur devis"
          className="w-28 px-2 py-1 text-right font-mono text-xs font-bold border border-zinc-300 rounded focus:border-[#D71920] focus:outline-hidden"
        />
      </td>
      <td className="py-2 px-2.5 text-center font-mono font-bold">
        {marginPct !== null ? (
          <span className={marginPct >= 0 ? 'text-emerald-700' : 'text-red-600'}>
            {marginPct >= 0 ? `+${marginPct}%` : `${marginPct}%`}
          </span>
        ) : (
          <span className="text-zinc-400">—</span>
        )}
      </td>
      <td className="py-2 px-2.5 text-center">
        <button
          onClick={() => {
            onSave(product.id, {
              reference: refVal.trim(),
              name: nameVal.trim(),
              sellingPriceAr: parsedSell,
              originalPriceAr: parsedBuy,
            });
            setDirty(false);
          }}
          disabled={!dirty}
          className={`px-3 py-1 text-[11px] font-bold rounded uppercase transition-colors ${
            dirty
              ? 'bg-[#D71920] text-white hover:bg-[#b8141a]'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Valider
        </button>
      </td>
    </tr>
  );
};
