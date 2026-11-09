import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { AdminProduct, AdminAuditSummary } from '../types/product';
import { formatAr } from '../utils/whatsapp';

interface AdminPortalProps {
  onBackToPublicSite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToPublicSite }) => {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('dsecure_admin_token');
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Data state
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [auditSummary, setAuditSummary] = useState<AdminAuditSummary | null>(null);
  const [internalFiles, setInternalFiles] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'products' | 'margins' | 'files'>('products');

  // Table filters
  const [filterSheet, setFilterSheet] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriceStatus, setFilterPriceStatus] = useState<'all' | 'priced' | 'missing' | 'flagged'>('all');
  const [sortBy, setSortBy] = useState<'ref' | 'margin' | 'purchase' | 'selling'>('ref');

  // Selected file preview modal
  const [filePreview, setFilePreview] = useState<{ name: string; content: string } | null>(null);

  // Authenticate
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Mot de passe incorrect.');
        setIsLoggingIn(false);
        return;
      }

      setToken(data.token);
      sessionStorage.setItem('dsecure_admin_token', data.token);
      setPasswordInput('');
    } catch (err: any) {
      setLoginError('Erreur de connexion au serveur.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('dsecure_admin_token');
    setProducts([]);
    setAuditSummary(null);
  };

  // Fetch Admin Data once authenticated
  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoadingData(true);
    setLoadError('');

    try {
      // Fetch confidential products
      const pRes = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (pRes.status === 401) {
        handleLogout();
        return;
      }

      const pData = await pRes.json();
      if (pData.success) {
        setProducts(pData.products);
      }

      // Fetch audit summary
      const sRes = await fetch('/api/admin/audit-summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sData = await sRes.json();
      if (sData.success) {
        setAuditSummary(sData.summary);
      }

      // Fetch files list
      const fRes = await fetch('/api/admin/files', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fData = await fRes.json();
      if (fData.success) {
        setInternalFiles(fData.files);
      }
    } catch (err: any) {
      setLoadError('Erreur lors du chargement des données administratives.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Unique sheets for filter
  const uniqueSheets = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.sourceSheet) set.add(p.sourceSheet);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered products for admin table
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (filterSheet !== 'Tous' && p.sourceSheet !== filterSheet) return false;
        if (filterPriceStatus === 'priced' && (!p.originalPriceAr || p.originalPriceAr <= 0)) return false;
        if (filterPriceStatus === 'missing' && (p.originalPriceAr && p.originalPriceAr > 0)) return false;
        if (filterPriceStatus === 'flagged' && !p.issue) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchRef = p.reference.toLowerCase().includes(q);
          const matchName = p.name.toLowerCase().includes(q);
          const matchSheet = (p.sourceSheet || '').toLowerCase().includes(q);
          const matchIssue = (p.issue || '').toLowerCase().includes(q);
          if (!matchRef && !matchName && !matchSheet && !matchIssue) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'margin') {
          return (b.marginAr || 0) - (a.marginAr || 0);
        }
        if (sortBy === 'purchase') {
          return (b.originalPriceAr || 0) - (a.originalPriceAr || 0);
        }
        if (sortBy === 'selling') {
          return (b.sellingPriceAr || 0) - (a.sellingPriceAr || 0);
        }
        return a.reference.localeCompare(b.reference);
      });
  }, [products, filterSheet, filterPriceStatus, searchQuery, sortBy]);

  // Export confidential CSV report
  const handleExportCSV = () => {
    if (products.length === 0) return;

    const headers = [
      'ID',
      'Feuille Excel',
      'Ligne Excel',
      'Référence',
      'Désignation',
      'Prix Achat Excel (Ar)',
      'Prix Vente Public (Ar)',
      'Marge Brute (Ar)',
      'Taux Marge (%)',
      'Statut Photo',
      'Signalement Audit',
    ];

    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.sourceSheet || ''}"`,
      `"${p.sourceRow || ''}"`,
      `"${p.reference.replace(/"/g, '""')}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      p.originalPriceAr ?? '',
      p.sellingPriceAr ?? '',
      p.marginAr ?? '',
      p.marginPercentage ? `${p.marginPercentage}%` : '',
      p.image ? 'Oui' : 'Non',
      `"${(p.issue || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `D_SECURE_Audit_Catalogue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preview internal file content
  const handleViewInternalFile = async (fileName: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/files/${encodeURIComponent(fileName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      setFilePreview({ name: fileName, content: text });
    } catch {
      alert('Impossible de charger le fichier.');
    }
  };

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN (Unauthenticated state)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#D71920]/20 border border-[#D71920]/40 flex items-center justify-center text-[#D71920] mx-auto mb-3 shadow-lg shadow-red-950/50">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              Espace Administrateur
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Portail interne D SECURE · Accès sécurisé aux données confidentielles
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Mot de passe gestionnaire *</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Entrez votre mot de passe d'administration..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 text-white text-sm rounded-lg px-3.5 py-2.5 border border-zinc-700 focus:outline-none focus:border-[#D71920]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Connexion Sécurisée</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <button
              onClick={onBackToPublicSite}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Retour au site public D SECURE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D71920] flex items-center justify-center text-white font-black text-sm">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black uppercase tracking-wider text-white">
                  Portail Interne · Direction D SECURE
                </h1>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.2 rounded font-bold">
                  Session Authentifiée
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Données d'achat, marges commerciales et traçabilité Excel protégées
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onBackToPublicSite}
              className="px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              Voir Site Public
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-900 rounded-md transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-[#D71920] text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Catalogue Confidentiel & Prix d'Achat ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('margins')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'margins'
                ? 'bg-[#D71920] text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Audit Financier & Marges</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'files'
                ? 'bg-[#D71920] text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Fichiers Excel Sources ({internalFiles.length})</span>
          </button>

          <div className="ml-auto">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              title="Exporter l'ensemble des données d'achat et de marge en CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter Rapport CSV</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoadingData && (
          <div className="p-8 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#D71920]" />
            <span>Chargement des données confidentielles depuis le serveur...</span>
          </div>
        )}

        {loadError && (
          <div className="p-4 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl">
            {loadError}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: CATALOGUE CONFIDENTIEL AVEC PRIX D'ACHAT & MARGES */}
        {/* ========================================================= */}
        {activeTab === 'products' && !isLoadingData && (
          <div className="space-y-4">
            {/* Quick KPI Strip */}
            {auditSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 block font-medium">Valeur d'Achat Totale</span>
                  <span className="text-base sm:text-lg font-black text-white font-mono">
                    {formatAr(auditSummary.totalPurchaseValueAr)}
                  </span>
                </div>
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 block font-medium">Valeur de Vente Totale</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                    {formatAr(auditSummary.totalSellingValueAr)}
                  </span>
                </div>
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 block font-medium">Marge Commerciale Brute</span>
                  <span className="text-base sm:text-lg font-black text-[#D71920] font-mono">
                    +{formatAr(auditSummary.grossMarginAr)} ({auditSummary.averageMarginPercent}%)
                  </span>
                </div>
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 block font-medium">Couverture Photographique</span>
                  <span className="text-base sm:text-lg font-black text-zinc-200 font-mono">
                    {auditSummary.withImageCount} / {auditSummary.totalCount} ({Math.round((auditSummary.withImageCount / auditSummary.totalCount) * 100)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Filter controls */}
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <input
                    type="text"
                    placeholder="Recherche réf, nom, feuille..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950 text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-1.5 border border-zinc-700 focus:outline-none focus:border-[#D71920]"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2 pointer-events-none" />
                </div>

                {/* Sheet select */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-400 text-[11px]">Feuille :</span>
                  <select
                    value={filterSheet}
                    onChange={(e) => setFilterSheet(e.target.value)}
                    className="bg-zinc-950 text-white border border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="Tous">Toutes les feuilles ({uniqueSheets.length})</option>
                    {uniqueSheets.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price status filter */}
                <select
                  value={filterPriceStatus}
                  onChange={(e) => setFilterPriceStatus(e.target.value as any)}
                  className="bg-zinc-950 text-white border border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">Tous les états</option>
                  <option value="priced">Avec prix d'achat valide</option>
                  <option value="missing">Prix manquant (Sur devis)</option>
                  <option value="flagged">Signalés à vérifier</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-[11px]">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-950 text-white border border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="ref">Référence</option>
                  <option value="margin">Marge la plus élevée</option>
                  <option value="purchase">Prix d'achat décroissant</option>
                  <option value="selling">Prix de vente décroissant</option>
                </select>
                <span className="text-zinc-500 font-mono text-[11px]">
                  {filteredProducts.length} articles
                </span>
              </div>
            </div>

            {/* Confidential Data Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider text-[10px] font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-3">Photo</th>
                    <th className="py-3 px-3">Référence & Nom</th>
                    <th className="py-3 px-3">Origine Excel</th>
                    <th className="py-3 px-3 text-right">Prix Achat (Excel)</th>
                    <th className="py-3 px-3 text-right">Prix Vente (Public)</th>
                    <th className="py-3 px-3 text-right">Marge Brute</th>
                    <th className="py-3 px-3 text-center">Taux</th>
                    <th className="py-3 px-3">Statut Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredProducts.map((p) => {
                    const hasPurchasePrice = typeof p.originalPriceAr === 'number' && p.originalPriceAr > 0;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Photo */}
                        <td className="py-2.5 px-3">
                          <div className="w-9 h-9 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="h-full w-full object-contain p-0.5" />
                            ) : (
                              <span className="text-[9px] text-zinc-600 font-sans">N/A</span>
                            )}
                          </div>
                        </td>

                        {/* Ref & Name */}
                        <td className="py-2.5 px-3 max-w-xs font-sans">
                          <span className="font-mono text-[#D71920] font-black block truncate text-xs">
                            {p.reference}
                          </span>
                          <span className="text-[11px] text-zinc-300 truncate block">
                            {p.name}
                          </span>
                        </td>

                        {/* Origin Excel */}
                        <td className="py-2.5 px-3 text-[11px] text-zinc-400">
                          <span className="bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                            {p.sourceSheet} (L.{p.sourceRow})
                          </span>
                        </td>

                        {/* Purchase Price (CONFIDENTIAL) */}
                        <td className="py-2.5 px-3 text-right text-zinc-300 font-bold">
                          {hasPurchasePrice ? `${p.originalPriceAr?.toLocaleString()} Ar` : (
                            <span className="text-amber-500 font-sans text-[11px]">Non spécifié</span>
                          )}
                        </td>

                        {/* Selling Price */}
                        <td className="py-2.5 px-3 text-right text-white font-black">
                          {p.formattedPrice}
                        </td>

                        {/* Margin Ar */}
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                          {p.marginAr !== null ? `+${p.marginAr.toLocaleString()} Ar` : '—'}
                        </td>

                        {/* Margin % */}
                        <td className="py-2.5 px-3 text-center">
                          {p.marginPercentage !== null ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              +{p.marginPercentage}%
                            </span>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>

                        {/* Audit Status */}
                        <td className="py-2.5 px-3 font-sans">
                          {p.issue ? (
                            <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[120px]">{p.issue}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Validé</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: AUDIT FINANCIER & RÈGLES DE MARGES */}
        {/* ========================================================= */}
        {activeTab === 'margins' && auditSummary && (
          <div className="space-y-6">
            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#D71920]" />
                Règles de Calcul & Politique Tarifaire Interne
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                  <span className="font-bold text-white text-sm block">
                    Palier 1 : Prix d'achat ≤ 300 000 Ar
                  </span>
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    Prix de vente = Prix d'achat × 2,00 (Marge brute de 100%)
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-sans">
                    Appliqué à tous les accessoires, caméras d'entrée de gamme, baluns et connectique afin de couvrir les frais logistiques unitaires et la garantie.
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                  <span className="font-bold text-white text-sm block">
                    Palier 2 : Prix d'achat &gt; 300 000 Ar
                  </span>
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    Prix de vente = Prix d'achat × 1,90 (Marge brute de 90%)
                  </div>
                  <p className="text-zinc-400 leading-relaxed font-sans">
                    Appliqué aux caméras IP haut de gamme, NVR/DVR multi-voies, switchs PoE et systèmes d'alarme pour assurer une forte compétitivité sur les projets d'envergure.
                  </p>
                </div>
              </div>
            </div>

            {/* Distribution par feuille Excel */}
            <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D71920]" />
                Répartition des Produits par Feuille Excel Source
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {Object.entries(auditSummary.sheetDistribution).map(([sheet, count]) => (
                  <div key={sheet} className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                    <span className="text-zinc-300 font-medium truncate">{sheet}</span>
                    <span className="font-mono font-bold text-[#D71920] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {count} réf.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FICHIERS EXCEL SOURCES CONSERVÉS SUR LE SERVEUR */}
        {/* ========================================================= */}
        {activeTab === 'files' && (
          <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D71920]" />
                Fichiers Sources Confidentiels (Stockage Serveur Sécurisé)
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Ces fichiers sont physiquement conservés hors du répertoire public web et ne peuvent pas être téléchargés sans authentification.
              </p>
            </div>

            <div className="space-y-3">
              {internalFiles.map((file) => (
                <div
                  key={file.name}
                  className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-[#D71920]">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white block text-sm">{file.name}</span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        Taille : {file.sizeFormatted} · Modifié : {new Date(file.modifiedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewInternalFile(file.name)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors flex items-center gap-1 font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examiner</span>
                    </button>
                    <a
                      href={`/api/admin/files/${encodeURIComponent(file.name)}`}
                      download
                      className="px-3 py-1.5 bg-[#D71920] hover:bg-[#b8141a] text-white rounded-md transition-colors flex items-center gap-1 font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        // Download using Bearer token
                        fetch(`/api/admin/files/${encodeURIComponent(file.name)}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        })
                          .then((res) => res.blob())
                          .then((blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = file.name;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          });
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Internal File Preview Modal */}
      {filePreview && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <span className="font-bold text-white text-sm font-mono">{filePreview.name}</span>
              <button
                onClick={() => setFilePreview(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto bg-zinc-950 font-mono text-xs text-zinc-300 whitespace-pre">
              {filePreview.content.slice(0, 100000)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
