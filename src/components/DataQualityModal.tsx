import React, { useState } from 'react';
import { Product } from '../types/product';
import { X, AlertCircle, CheckCircle2, FileSpreadsheet, Image, DollarSign, Search } from 'lucide-react';

interface DataQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const DataQualityModal: React.FC<DataQualityModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'no-image' | 'no-price'>('flagged');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const totalCount = products.length;
  const withImageCount = products.filter((p) => p.image !== null).length;
  const withPriceCount = products.filter((p) => p.sellingPriceAr !== null).length;
  const missingPriceCount = products.filter((p) => p.sellingPriceAr === null).length;
  const flaggedCount = products.filter((p) => p.issue !== null).length;

  let filtered = products.filter((p) => {
    if (filter === 'flagged') return p.issue !== null;
    if (filter === 'no-image') return p.image === null;
    if (filter === 'no-price') return p.sellingPriceAr === null;
    return true;
  });

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.reference.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.issue && p.issue.toLowerCase().includes(q))
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-zinc-950 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D71920]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Contrôle Qualité & Audit Données Excel
              </h3>
              <p className="text-xs text-zinc-400">
                Traçabilité des classeurs sources Hikvision et vérifications de conformité (a_verifier.csv)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-zinc-900/40 border-b border-zinc-800/60 text-xs">
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">Total Fiches Excel</span>
            <span className="text-lg font-bold font-mono text-white">{totalCount}</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">Photos associées</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{withImageCount}</span>
            <span className="text-[10px] text-zinc-500 block">sur 64 images sources</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">Prix calculés (×2)</span>
            <span className="text-lg font-bold font-mono text-white">{withPriceCount}</span>
            <span className="text-[10px] text-zinc-500 block">{missingPriceCount} prix sur demande</span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
            <span className="text-zinc-500 block mb-0.5">Lignes à contrôler</span>
            <span className="text-lg font-bold font-mono text-amber-400">{flaggedCount}</span>
            <span className="text-[10px] text-zinc-500 block">issues de a_verifier.csv</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-950">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'flagged' ? 'bg-[#D71920] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Signalés a_verifier ({flaggedCount})
            </button>
            <button
              onClick={() => setFilter('no-image')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'no-image' ? 'bg-[#D71920] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Sans image originale
            </button>
            <button
              onClick={() => setFilter('no-price')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'no-price' ? 'bg-[#D71920] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Prix sur demande ({missingPriceCount})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                filter === 'all' ? 'bg-[#D71920] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              Tous les produits
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Filtrer réf ou note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 text-xs text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-1.5 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Aucun produit ne correspond à ce filtre.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="bg-zinc-900/50 hover:bg-zinc-900 p-3 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center justify-between gap-4 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <Image className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-mono">N/A</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#D71920] truncate">
                        {item.reference}
                      </span>
                      <span className="text-[10px] text-zinc-500">· {item.category}</span>
                    </div>
                    <span className="text-zinc-300 truncate block">{item.name}</span>
                    {item.issue && (
                      <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{item.issue}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-white block">
                    {item.formattedPrice}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {item.sourceSheet} (L.{item.sourceRow})
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 text-xs text-zinc-500 flex items-center justify-between">
          <span>Règle de prix : Prix de vente = Prix d'achat Excel × 2 (sans double calcul).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
