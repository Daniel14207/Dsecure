import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  FileSpreadsheet,
  DollarSign,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle2,
  Search,
  ArrowUpDown,
  LogOut,
  RefreshCw,
  Eye,
  FileText,
  Key,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Check,
  X,
  User,
  Users,
  ShoppingCart,
  Package,
  Calendar,
  Phone,
  MapPin,
  Clock,
  BarChart3,
  Database,
  Save,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronDown
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
import { SURVEILLANCE_PACKS } from '../data/surveillancePacks';
import { formatAr } from '../utils/whatsapp';

interface AdminPortalProps {
  onBackToPublicSite: () => void;
  onCatalogUpdated?: (products: Product[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToPublicSite,
  onCatalogUpdated,
}) => {
  // Session token
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('dsecure_admin_token');
  });

  // Login form state - starts strictly empty
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Inactivity timeout (30 minutes)
  const lastActivityRef = useRef<number>(Date.now());
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(30 * 60);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'availability'
    | 'prices'
    | 'categories'
    | 'packs'
    | 'orders'
    | 'customers'
    | 'analytics'
    | 'audit'
  >('overview');

  // Main datasets
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [summary, setSummary] = useState<AdminAuditSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [availableImages, setAvailableImages] = useState<Array<{ path: string; name: string; category: string }>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Table filters & search
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Modals state
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<AdminProduct> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTargetProduct, setImagePickerTargetProduct] = useState<AdminProduct | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySection, setNewCategorySection] = useState<'cameras' | 'alarms' | 'packs' | 'dvr_nvr' | 'accessories' | 'hdd' | 'network' | 'monitors'>('accessories');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
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
        handleLogout('Session fermée automatiquement pour inactivité (30 min).');
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
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Mot de passe administrateur incorrect.');
        setIsLoggingIn(false);
        return;
      }

      setToken(data.token);
      sessionStorage.setItem('dsecure_admin_token', data.token);
      setPasswordInput('');
      lastActivityRef.current = Date.now();
      showToast('Authentification réussie. Bienvenue dans votre espace administrateur.');
    } catch (err: any) {
      setLoginError('Erreur de communication avec le serveur.');
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
    sessionStorage.removeItem('dsecure_admin_token');
    setPasswordInput('');
    if (reason) {
      setLoginError(reason);
    }
  };

  // -------------------------------------------------------------
  // DATA FETCHING
  // -------------------------------------------------------------
  const loadAllAdminData = async () => {
    if (!token) return;
    setIsLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Dashboard summary
      const sRes = await fetch('/api/admin/dashboard-stats', { headers });
      if (sRes.status === 401) {
        handleLogout('Votre session a expiré. Veuillez vous reconnecter.');
        return;
      }
      const sData = await sRes.json();
      if (sData.success) {
        setSummary(sData.summary);
      }

      // 2. Products
      const pRes = await fetch('/api/admin/products', { headers });
      const pData = await pRes.json();
      if (pData.success) {
        setProducts(pData.products);
        if (onCatalogUpdated) {
          onCatalogUpdated(pData.products);
        }
      }

      // 3. Orders
      const oRes = await fetch('/api/admin/orders', { headers });
      const oData = await oRes.json();
      if (oData.success) {
        setOrders(oData.orders);
      }

      // 4. Customers
      const cRes = await fetch('/api/admin/customers', { headers });
      const cData = await cRes.json();
      if (cData.success) {
        setCustomers(cData.customers);
      }

      // 5. Analytics
      const aRes = await fetch('/api/admin/analytics', { headers });
      const aData = await aRes.json();
      if (aData.success) {
        setAnalytics(aData.analytics);
      }

      // 6. Audit logs
      const lRes = await fetch('/api/admin/audit-logs', { headers });
      const lData = await lRes.json();
      if (lData.success) {
        setAuditLogs(lData.logs);
      }

      // 7. Categories
      const catRes = await fetch('/api/admin/categories', { headers });
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
      }

      // 8. Available images gallery
      const imgRes = await fetch('/api/admin/available-images', { headers });
      const imgData = await imgRes.json();
      if (imgData.success) {
        setAvailableImages(imgData.images);
      }
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
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
  // PRODUCT OPERATIONS
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
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, isAvailable: nextStatus } : p))
        );
        if (onCatalogUpdated) {
          onCatalogUpdated(products.map((p) => (p.id === product.id ? { ...p, isAvailable: nextStatus } : p)));
        }
        showToast(
          `Statut de ${product.reference} mis à jour : ${nextStatus ? 'DISPONIBLE' : 'INDISPONIBLE'}`
        );
      } else {
        showToast('Erreur lors de la modification de disponibilité.', 'error');
      }
    } catch (e) {
      showToast('Erreur serveur.', 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.reference || !editingProduct.name) {
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
        showToast(isNew ? 'Nouveau matériel ajouté avec succès !' : 'Matériel modifié avec succès !');
      } else {
        showToast(data.error || 'Erreur lors de l\'enregistrement.', 'error');
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
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        showToast(`Matériel ${productToDelete.reference} supprimé définitivement.`);
        loadAllAdminData();
      } else {
        showToast(data.error || 'Erreur lors de la suppression.', 'error');
      }
    } catch {
      showToast('Erreur réseau.', 'error');
    }
  };

  // Quick price update
  const handleQuickPriceUpdate = async (productId: string, newSellingPrice: number) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellingPriceAr: newSellingPrice }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, ...data.product } : p))
        );
        showToast(`Prix mis à jour : ${formatAr(newSellingPrice)}`);
      }
    } catch {
      showToast('Erreur mise à jour prix.', 'error');
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o))
        );
        showToast(`Statut commande mis à jour : ${newStatus}`);
      }
    } catch {
      showToast('Erreur mise à jour commande.', 'error');
    }
  };

  // Apply chosen image to product
  const handleApplyImageToProduct = async (imagePath: string) => {
    if (!imagePickerTargetProduct) return;
    try {
      const res = await fetch(`/api/admin/products/${imagePickerTargetProduct.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imagePath }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === imagePickerTargetProduct.id ? { ...p, image: imagePath } : p))
        );
        setIsImagePickerOpen(false);
        setImagePickerTargetProduct(null);
        showToast(`Image associée avec succès au produit ${imagePickerTargetProduct.reference} !`);
      }
    } catch {
      showToast('Erreur association image.', 'error');
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.topSection !== categoryFilter && p.category !== categoryFilter) {
        return false;
      }
      if (availabilityFilter === 'available' && p.isAvailable === false) return false;
      if (availabilityFilter === 'unavailable' && p.isAvailable !== false) return false;

      if (productSearch.trim()) {
        const query = productSearch.toLowerCase();
        const matchRef = p.reference.toLowerCase().includes(query);
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description ? p.description.toLowerCase().includes(query) : false;
        if (!matchRef && !matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [products, categoryFilter, availabilityFilter, productSearch]);

  // Format session time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // -------------------------------------------------------------
  // VIEW: 1. LOGIN SCREEN (Strictly secured & empty initial fields)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 selection:bg-[#D71920] selection:text-white">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Brand Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D71920] via-red-600 to-zinc-900" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-black border border-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D71920] shadow-inner">
              <Shield className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-black uppercase tracking-tight text-white font-mono">
              ESPACE ADMINISTRATEUR
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              Portail interne D SECURE &bull; Accès sécurisé aux données confidentielles
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-6 p-3.5 bg-red-950/80 border border-red-800/80 text-red-200 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-snug">{loginError}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Mot de Passe Propriétaire
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Entrez votre mot de passe secret..."
                  autoComplete="off"
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-hidden focus:border-[#D71920] focus:ring-1 focus:ring-[#D71920] transition-all font-mono"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[10px] text-zinc-500 mt-1.5 block">
                Session protégée par chiffrement côté serveur & protection anti-brute force.
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
                  <span>VÉRIFICATION SÉCURISÉE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>ACCÉDER AU TABLEAU DE BORD</span>
                </>
              )}
            </button>
          </form>

          {/* Footer return */}
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
  // VIEW: 2. AUTHENTICATED DASHBOARD
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D71920] text-white flex items-center justify-center font-black text-sm tracking-wider shadow-sm">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight uppercase">D SECURE GESTION</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                  EN DIRECT
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 block">Portail Propriétaire & Administration</span>
            </div>
          </div>

          {/* Session timer & Action buttons */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Inactivité : <strong className="font-mono text-white">{formatTime(sessionTimeRemaining)}</strong></span>
            </div>

            <button
              onClick={loadAllAdminData}
              disabled={isLoading}
              title="Rafraîchir les données"
              className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onBackToPublicSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-medium text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir le site public</span>
            </button>

            <button
              onClick={() => handleLogout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 transition-colors font-bold text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-xl border border-zinc-200 p-1.5 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Vue d&apos;ensemble</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Matériels ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'availability'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Disponibilité</span>
            </button>

            <button
              onClick={() => setActiveTab('prices')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'prices'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Prix & Marges</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catégories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('packs')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'packs'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Packs Vidéosurveillance (12)</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Commandes ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'customers'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clients ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Visiteurs ({summary?.totalVisits || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-600" />
              <span>Journal & Sauvegardes</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: VUE D'ENSEMBLE (KPIs Réels)                         */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                  Total Matériels
                </span>
                <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                  {summary?.totalCount || products.length}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Dans le catalogue actif
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                  Disponibles
                </span>
                <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
                  {summary?.availableCount || products.filter((p) => p.isAvailable !== false).length}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  En stock / commandable
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">
                  Indisponibles
                </span>
                <span className="text-2xl font-black text-red-600 font-mono mt-1 block">
                  {summary?.unavailableCount || products.filter((p) => p.isAvailable === false).length}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Temporairement absents
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D71920] block">
                  Commandes Reçues
                </span>
                <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {orders.filter((o) => o.status === 'Nouvelle commande').length} nouvelle(s)
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                  Visiteurs du Site
                </span>
                <span className="text-2xl font-black text-zinc-900 font-mono mt-1 block">
                  {summary?.totalVisits || analytics?.totalVisits || 0}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {analytics?.todayVisits || 0} aujourd&apos;hui
                </span>
              </div>
            </div>

            {/* Financial Overview (Confidential Admin) */}
            <div className="bg-zinc-950 text-white rounded-2xl p-6 border border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#D71920]">
                    SYNTHÈSE FINANCIÈRE CONFIDENTIELLE (D SECURE)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Calculée sur les prix d&apos;achat réels et les prix de vente publics actuels
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded">
                  Usage Interne Exclusif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Valeur Totale Vente</span>
                  <span className="text-xl font-black font-mono text-white mt-1 block">
                    {formatAr(summary?.totalSellingValueAr)}
                  </span>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Coût Total Achat</span>
                  <span className="text-xl font-black font-mono text-zinc-300 mt-1 block">
                    {formatAr(summary?.totalPurchaseValueAr)}
                  </span>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block">Marge Brute Globale</span>
                  <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                    +{formatAr(summary?.grossMarginAr)}
                  </span>
                </div>

                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-bold text-red-400 uppercase block">Marge Moyenne</span>
                  <span className="text-xl font-black font-mono text-red-400 mt-1 block">
                    +{summary?.averageMarginPercent || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2">
                  Raccourcis de Gestion
                </h4>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      reference: '',
                      category: 'Caméras de Surveillance',
                      topSection: 'cameras',
                      sellingPriceAr: 0,
                      isAvailable: true,
                    });
                    setIsEditProductModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un nouveau matériel</span>
                </button>

                <button
                  onClick={() => setActiveTab('prices')}
                  className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <DollarSign className="w-4 h-4 text-[#D71920]" />
                  <span>Modifier rapidement un prix</span>
                </button>

                <button
                  onClick={() => setActiveTab('availability')}
                  className="w-full py-2.5 px-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gérer les disponibilités</span>
                </button>
              </div>

              {/* Recent Activity Log */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3 flex items-center justify-between">
                  <span>Dernières Activités du Site</span>
                  <span className="text-[10px] font-mono text-zinc-400">Journal d&apos;audit en temps réel</span>
                </h4>

                <div className="divide-y divide-zinc-100 max-h-64 overflow-y-auto">
                  {auditLogs.length === 0 ? (
                    <div className="text-xs text-zinc-400 py-6 text-center">Aucune activité enregistrée.</div>
                  ) : (
                    auditLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-start justify-between text-xs gap-3">
                        <div>
                          <span className="font-bold text-zinc-900">{log.entityName || log.entityId}</span>
                          <span className="text-zinc-500 block text-[11px]">{log.details}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 whitespace-nowrap font-mono">
                          {new Date(log.timestamp).toLocaleDateString('fr-FR', {
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
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto flex-1">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Rechercher par référence, nom..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-hidden focus:border-[#D71920]"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Category Filter */}
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

                {/* Availability Filter */}
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-hidden"
                >
                  <option value="all">Toutes disponibilités</option>
                  <option value="available">Disponibles uniquement</option>
                  <option value="unavailable">Indisponibles uniquement</option>
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    reference: '',
                    category: 'Caméras de Surveillance',
                    topSection: 'cameras',
                    sellingPriceAr: 0,
                    isAvailable: true,
                  });
                  setIsEditProductModalOpen(true);
                }}
                className="py-2 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
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
                    <th className="py-2.5 px-3">Référence Exacte</th>
                    <th className="py-2.5 px-3">Désignation</th>
                    <th className="py-2.5 px-3">Section</th>
                    <th className="py-2.5 px-3 text-right">Prix Achat</th>
                    <th className="py-2.5 px-3 text-right">Prix Vente</th>
                    <th className="py-2.5 px-3 text-center">Disponibilité</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.slice(0, 100).map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="py-2 px-3">
                        <div
                          onClick={() => {
                            if (product.image) setImagePreviewUrl(product.image);
                          }}
                          className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 p-1 flex items-center justify-center cursor-pointer hover:border-zinc-400 overflow-hidden"
                          title="Cliquez pour agrandir"
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.reference}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-zinc-300" />
                          )}
                        </div>
                      </td>

                      {/* Reference SKU */}
                      <td className="py-2 px-3 font-mono font-bold text-[#D71920]">
                        {product.reference}
                      </td>

                      {/* Name */}
                      <td className="py-2 px-3">
                        <div className="font-semibold text-zinc-900 max-w-xs truncate" title={product.name}>
                          {product.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-xs">{product.category}</div>
                      </td>

                      {/* Section */}
                      <td className="py-2 px-3">
                        <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-bold uppercase">
                          {product.topSection}
                        </span>
                      </td>

                      {/* Purchase Price (Admin only) */}
                      <td className="py-2 px-3 text-right font-mono text-zinc-500">
                        {formatAr(product.originalPriceAr)}
                      </td>

                      {/* Selling Price */}
                      <td className="py-2 px-3 text-right font-mono font-bold text-zinc-950">
                        {product.formattedPrice}
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleToggleAvailability(product)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide transition-all ${
                            product.isAvailable !== false
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Cliquez pour basculer le statut"
                        >
                          {product.isAvailable !== false ? 'DISPONIBLE' : 'INDISPONIBLE'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit Details */}
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsEditProductModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-200 rounded-md transition-colors"
                            title="Modifier ce matériel"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Choose Photo */}
                          <button
                            onClick={() => {
                              setImagePickerTargetProduct(product);
                              setIsImagePickerOpen(true);
                            }}
                            className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-zinc-200 rounded-md transition-colors"
                            title="Changer la photo"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer ce matériel"
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

            {filteredProducts.length > 100 && (
              <div className="text-center text-xs text-zinc-400 pt-2 font-mono">
                Affichage des 100 premiers matériels sur {filteredProducts.length} correspondants.
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: GESTION DE LA DISPONIBILITÉ                       */}
        {/* ========================================================= */}
        {activeTab === 'availability' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
            {/* Explanatory Rule Banner */}
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl text-xs text-zinc-800 space-y-1">
              <strong className="text-[#D71920] font-black uppercase tracking-wider block">
                Règle Fondamentale de Disponibilité des Matériels D SECURE :
              </strong>
              <p className="leading-relaxed">
                Lorsqu&apos;un matériel est marqué <strong>INDISPONIBLE</strong>, il n&apos;est jamais effacé du site public.
                La fiche produit reste consultable avec sa photographie, son nom, sa référence et son prix, avec le badge rouge officiel <strong>« INDISPONIBLE »</strong>.
                Le client peut réserver ou demander des informations via WhatsApp. Dès que vous le réactivez ici, le statut redevient instantanément <strong>« DISPONIBLE »</strong>.
              </p>
            </div>

            {/* Quick summary counts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
                <span className="text-xs uppercase font-bold text-emerald-800 block">Matériels Actuellement Disponibles</span>
                <span className="text-3xl font-black font-mono text-emerald-700 mt-1 block">
                  {products.filter((p) => p.isAvailable !== false).length}
                </span>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                <span className="text-xs uppercase font-bold text-red-800 block">Matériels Indisponibles (Sur Commande)</span>
                <span className="text-3xl font-black font-mono text-red-700 mt-1 block">
                  {products.filter((p) => p.isAvailable === false).length}
                </span>
              </div>
            </div>

            {/* Fast Toggle Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Référence</th>
                    <th className="py-2.5 px-3">Nom du Matériel</th>
                    <th className="py-2.5 px-3">Catégorie</th>
                    <th className="py-2.5 px-3 text-center">Statut Public Actuel</th>
                    <th className="py-2.5 px-3 text-center">Action Directe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#D71920]">{product.reference}</td>
                      <td className="py-2.5 px-3 font-semibold text-zinc-900">{product.name}</td>
                      <td className="py-2.5 px-3 text-zinc-500">{product.category}</td>
                      <td className="py-2.5 px-3 text-center">
                        {product.isAvailable !== false ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            DISPONIBLE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-full">
                            <X className="w-3 h-3" />
                            INDISPONIBLE
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleAvailability(product)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            product.isAvailable !== false
                              ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {product.isAvailable !== false ? 'Marquer Indisponible' : 'Marquer Disponible'}
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
        {/* TAB 4: GESTION RAPIDE DES PRIX & MARGES                  */}
        {/* ========================================================= */}
        {activeTab === 'prices' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Modification Rapide des Prix & Références
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Modifiez directement le prix de vente d&apos;un équipement pour actualisation immédiate sur le site public
                </p>
              </div>

              <div className="relative max-w-xs">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filtrer par référence..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Référence</th>
                    <th className="py-2.5 px-3">Désignation</th>
                    <th className="py-2.5 px-3 text-right">Prix Achat (Confidentiel)</th>
                    <th className="py-2.5 px-3 text-right">Prix Vente Actuel</th>
                    <th className="py-2.5 px-3 text-right">Nouveau Prix Vente (Ar)</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredProducts.slice(0, 50).map((product) => {
                    return (
                      <PriceRow
                        key={product.id}
                        product={product}
                        onSave={handleQuickPriceUpdate}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: GESTION DES CATÉGORIES                             */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Gestion des Catégories du Catalogue
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Organisez les familles de matériels et préservez l&apos;architecture de navigation
                </p>
              </div>

              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="py-2 px-3 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une catégorie</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold text-[#D71920] tracking-wider font-mono">
                        {cat.topSection}
                      </span>
                      <span className="text-[10px] font-bold bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">
                        {cat.productCount} matériels
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-zinc-900">{cat.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{cat.description || 'Section officielle du catalogue.'}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                    <button
                      onClick={() => {
                        setCategoryFilter(cat.topSection);
                        setActiveTab('products');
                      }}
                      className="text-zinc-600 hover:text-black font-bold flex items-center gap-1"
                    >
                      <span>Voir les matériels</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: GESTION DES PACKS                                  */}
        {/* ========================================================= */}
        {activeTab === 'packs' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Gestion des Packs Vidéosurveillance Clés en Main (12 Packs)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Distinction rigoureuse entre packs ANALOGIQUES Turbo HD et packs IP NUMÉRIQUES PoE
                </p>
              </div>

              <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-3 py-1 rounded-lg">
                Calcul automatique BOM vérifié
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SURVEILLANCE_PACKS.map((pack) => (
                <div key={pack.id} className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 flex flex-col justify-between">
                  <div>
                    <div className="aspect-16/10 bg-white rounded-lg border border-zinc-200 p-2 flex items-center justify-center overflow-hidden mb-3">
                      <img
                        src={pack.image}
                        alt={pack.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#D71920] text-white">
                        {pack.technology}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 font-mono">
                        {pack.camerasCount} Cams
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-zinc-900 leading-snug">{pack.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{pack.tagline}</p>

                    <div className="mt-3 text-xs bg-white p-2.5 rounded-lg border border-zinc-200 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Composants BOM :</span>
                        <span className="font-bold text-zinc-800">{pack.bom.length} matériels</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Pose à Tana :</span>
                        <span className="font-bold text-emerald-600">OFFERTE (0 Ar)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Prix Total Pack</span>
                      <span className="text-base font-black text-zinc-950 font-mono">
                        {pack.formattedPrice}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                      Prêt à la vente
                    </span>
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
                  Historique Réel des Commandes Clients
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Commandes reçues en ligne depuis le panier ou via réservation WhatsApp
                </p>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-bold">Filtrer par statut :</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg"
                >
                  <option value="all">Toutes les commandes</option>
                  <option value="Nouvelle commande">Nouvelles commandes</option>
                  <option value="En attente de confirmation">En attente</option>
                  <option value="Confirmée">Confirmées</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Livrée">Livrées</option>
                  <option value="Annulée">Annulées</option>
                </select>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-500 text-xs">
                <ShoppingCart className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <strong className="text-zinc-800 text-sm block">Aucune commande enregistrée pour l&apos;instant</strong>
                <p className="mt-1 max-w-sm mx-auto">
                  Dès qu&apos;un client valide une commande sur le site ou via WhatsApp, elle apparaîtra instantanément ici avec son montant et ses matériels.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">N° Commande</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Client</th>
                      <th className="py-2.5 px-3">Téléphone</th>
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
                          <td className="py-2.5 px-3 text-zinc-500 font-mono">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-zinc-900">
                            {order.customer.fullName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-zinc-700">
                            {order.customer.phone}
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600">
                            {order.items.reduce((s, it) => s + it.quantity, 0)} article(s)
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
                              <option value="En attente de confirmation">En attente</option>
                              <option value="Confirmée">Confirmée</option>
                              <option value="En préparation">En préparation</option>
                              <option value="Livrée">Livrée</option>
                              <option value="Annulée">Annulée</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-2.5 py-1 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold rounded-md"
                            >
                              Voir
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
                Répertoire des Clients Réels ({customers.length})
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Compilé exclusivement à partir des commandes et coordonnées réelles soumises sur le site
              </p>
            </div>

            {customers.length === 0 ? (
              <div className="text-center py-16 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-500 text-xs">
                <Users className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <strong className="text-zinc-800 text-sm block">Aucun client enregistré pour l&apos;instant</strong>
                <p className="mt-1">
                  Les clients ayant passé commande ou demandé un devis s&apos;afficheront automatiquement ici.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Nom du Client</th>
                      <th className="py-2.5 px-3">Téléphone / WhatsApp</th>
                      <th className="py-2.5 px-3">Adresse de Livraison</th>
                      <th className="py-2.5 px-3 text-center">Commandes</th>
                      <th className="py-2.5 px-3 text-right">Total Dépensé</th>
                      <th className="py-2.5 px-3">Dernière Commande</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 9: SUIVI DES VISITEURS & ANALYTICS                   */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                Statistiques de Fréquentation & Visiteurs (Anonymisées)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Mesure d&apos;audience réelle sans cookies intrusifs ni collecte de données personnelles
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block">Visites Totales</span>
                <span className="text-3xl font-black font-mono text-zinc-900 mt-1 block">
                  {analytics?.totalVisits || summary?.totalVisits || 0}
                </span>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">Visites Aujourd&apos;hui</span>
                <span className="text-3xl font-black font-mono text-emerald-600 mt-1 block">
                  {analytics?.todayVisits || 0}
                </span>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <span className="text-[10px] font-bold text-[#D71920] uppercase block">Dernier Passage</span>
                <span className="text-sm font-bold font-mono text-zinc-700 mt-2 block">
                  {analytics?.lastVisitedAt
                    ? new Date(analytics.lastVisitedAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Aujourd\'hui'}
                </span>
              </div>
            </div>

            {/* Pages Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3">
                  Pages les Plus Consultées
                </h4>
                <div className="space-y-2 text-xs">
                  {analytics && Object.entries(analytics.pageViews).map(([page, count]) => (
                    <div key={page} className="flex justify-between items-center py-1.5 border-b border-zinc-200/60">
                      <span className="font-mono text-zinc-800">{page}</span>
                      <span className="font-mono font-bold text-[#D71920]">{count} vues</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic timeline */}
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-3">
                  Historique Journalier Récent
                </h4>
                <div className="space-y-2 text-xs">
                  {analytics && analytics.dailyVisits.slice(-7).map((day) => (
                    <div key={day.date} className="flex justify-between items-center py-1.5 border-b border-zinc-200/60">
                      <span className="font-mono text-zinc-700">{day.date}</span>
                      <span className="font-mono font-bold text-zinc-900">{day.visits} visites</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 10: JOURNAL D'AUDIT & SAUVEGARDES                     */}
        {/* ========================================================= */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900">
                  Journal des Opérations & Sauvegarde Complète
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Historique certifié de toutes les modifications administratives et export de sécurité
                </p>
              </div>

              <a
                href="/api/admin/export-database"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-4 h-4 text-[#D71920]" />
                <span>Exporter la Base JSON</span>
              </a>
            </div>

            {/* Audit table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Horodatage</th>
                    <th className="py-2.5 px-3">Type d&apos;Action</th>
                    <th className="py-2.5 px-3">Cible</th>
                    <th className="py-2.5 px-3">Détails de l&apos;Opération</th>
                    <th className="py-2.5 px-3">Auteur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-zinc-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#D71920]">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-zinc-900">
                        {log.entityName || log.entityId}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-700">{log.details}</td>
                      <td className="py-2.5 px-3 text-zinc-500">{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT                                 */}
      {/* ========================================================= */}
      {isEditProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
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
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Référence Exacte (SKU) *
                  </label>
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
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Désignation Complète *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-900"
                    placeholder="ex: Caméra Bullet Turbo HD 2MP EXIR"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Catégorie Principale
                  </label>
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
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Sous-Catégorie / Libellé
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg"
                    placeholder="ex: Caméras analogiques"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Prix d&apos;Achat (Confidentiel Ar)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPriceAr || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPriceAr: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                    placeholder="ex: 70000"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 uppercase mb-1">
                    Prix de Vente Public (Ar) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.sellingPriceAr || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sellingPriceAr: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono font-bold text-zinc-950"
                    placeholder="ex: 140000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">
                  Description & Spécifications Techniques
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg leading-relaxed"
                  placeholder="Spécifications capteur, résolution, portée nocturne..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 uppercase mb-1">
                  Chemin / URL de la Photographie
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-xs"
                    placeholder="/images/CAMERAS_IP/... ou URL"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePickerTargetProduct(editingProduct as AdminProduct);
                      setIsImagePickerOpen(true);
                    }}
                    className="px-3 py-2 bg-zinc-800 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Choisir Photo</span>
                  </button>
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
                  Matériel actuellement disponible en stock (Actif)
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
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION                        */}
      {/* ========================================================= */}
      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-center text-base font-black uppercase text-zinc-900 tracking-tight">
              Confirmer la suppression
            </h3>

            <p className="text-center text-xs text-zinc-600 mt-2">
              Êtes-vous sûr de vouloir supprimer définitivement le matériel :
            </p>
            <div className="my-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center font-mono text-xs font-bold text-red-600">
              {productToDelete.reference} &bull; {productToDelete.name}
            </div>
            <p className="text-center text-[11px] text-zinc-400">
              Cette action retirera le matériel du catalogue et de la base de données.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 border border-zinc-300 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-100"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: IMAGE PICKER & PREVIEW GALLERY                     */}
      {/* ========================================================= */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <h3 className="text-base font-black uppercase text-zinc-900 tracking-tight">
                  Sélecteur de Photographies Authentiques ({availableImages.length} photos)
                </h3>
                <p className="text-xs text-zinc-500">
                  Choisissez une photographie originale du matériel pour l&apos;associer directement
                </p>
              </div>
              <button
                onClick={() => {
                  setIsImagePickerOpen(false);
                  setImagePickerTargetProduct(null);
                }}
                className="text-zinc-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-1">
              {availableImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (editingProduct) {
                      setEditingProduct({ ...editingProduct, image: img.path });
                      setIsImagePickerOpen(false);
                    } else if (imagePickerTargetProduct) {
                      handleApplyImageToProduct(img.path);
                    }
                  }}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-2 flex flex-col items-center justify-between cursor-pointer hover:border-[#D71920] hover:shadow-md transition-all group"
                >
                  <div className="aspect-square w-full flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src={img.path}
                      alt={img.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
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
      {/* MODAL: ORDER DETAILS                                      */}
      {/* ========================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#D71920]">
                  COMMANDE {selectedOrderDetails.orderNumber}
                </span>
                <h3 className="text-base font-black uppercase text-zinc-900 tracking-tight">
                  Détail de la Commande
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-zinc-400 hover:text-black p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer info */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Client</span>
                  <span className="font-bold text-zinc-900">{selectedOrderDetails.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Téléphone</span>
                  <span className="font-mono font-bold text-zinc-900">{selectedOrderDetails.customer.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Adresse de Livraison</span>
                  <span className="text-zinc-700">{selectedOrderDetails.customer.address}</span>
                </div>
                {selectedOrderDetails.customer.note && (
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Note du Client</span>
                    <span className="text-zinc-600 italic">&ldquo;{selectedOrderDetails.customer.note}&rdquo;</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="border border-zinc-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold uppercase text-zinc-500">
                    <tr>
                      <th className="py-2 px-3">Qté</th>
                      <th className="py-2 px-3">Référence</th>
                      <th className="py-2 px-3">Désignation</th>
                      <th className="py-2 px-3 text-right">Prix Unitaire</th>
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

              {/* Total & Status */}
              <div className="flex justify-between items-center p-3 bg-zinc-900 text-white rounded-xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Statut Actuel</span>
                  <span className="font-bold text-sm text-[#D71920]">{selectedOrderDetails.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Montant Total</span>
                  <span className="text-lg font-black font-mono text-white">{selectedOrderDetails.formattedTotal}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-200 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg uppercase"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: IMAGE PREVIEW                                      */}
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

// Component for in-line price editing row
interface PriceRowProps {
  product: AdminProduct;
  onSave: (id: string, price: number) => void;
}

const PriceRow: React.FC<PriceRowProps> = ({ product, onSave }) => {
  const [val, setVal] = useState<number>(product.sellingPriceAr || 0);
  const [dirty, setDirty] = useState(false);

  return (
    <tr className="hover:bg-zinc-50 transition-colors">
      <td className="py-2.5 px-3 font-mono font-bold text-[#D71920]">{product.reference}</td>
      <td className="py-2.5 px-3 font-semibold text-zinc-900 max-w-xs truncate">{product.name}</td>
      <td className="py-2.5 px-3 text-right font-mono text-zinc-500">
        {formatAr(product.originalPriceAr)}
      </td>
      <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-800">
        {product.formattedPrice}
      </td>
      <td className="py-2.5 px-3 text-right">
        <input
          type="number"
          value={val}
          onChange={(e) => {
            setVal(Number(e.target.value) || 0);
            setDirty(true);
          }}
          className="w-28 px-2 py-1 text-right font-mono text-xs font-bold border border-zinc-300 rounded focus:border-[#D71920] focus:outline-hidden"
        />
      </td>
      <td className="py-2.5 px-3 text-center">
        <button
          onClick={() => {
            onSave(product.id, val);
            setDirty(false);
          }}
          disabled={!dirty}
          className={`px-2.5 py-1 text-[11px] font-bold rounded uppercase transition-colors ${
            dirty
              ? 'bg-[#D71920] text-white hover:bg-[#b8141a]'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          Enregistrer
        </button>
      </td>
    </tr>
  );
};
