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
  const [filter, setFilter] = useState<'all' | 'flagged' | 'no-image' | 'no-price'>('all');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white border border-zinc-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#D71920]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">
                Audit & Traçabilité des Données Excel
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Vérification d'intégrité du catalogue products.json · Formule tarifaire appliquée
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-zinc-50 border-b border-zinc-200 text-xs">
          <div className="p-3 bg-white rounded-xl border border-zinc-200">
            <span className="text-zinc-500 block font-medium">Articles au catalogue</span>
            <span className="text-lg font-black text-zinc-900 font-mono">{totalCount}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-zinc-200">
            <span className="text-zinc-500 block font-medium">Photos réelles associées</span>
            <span className="text-lg font-black text-emerald-600 font-mono">
              {withImageCount} <span className="text-xs text-zinc-400">/ {totalCount}</span>
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-zinc-200">
            <span className="text-zinc-500 block font-medium">Prix calculés valides</span>
            <span className="text-lg font-black text-zinc-900 font-mono">
              {withPriceCount} <span className="text-xs text-zinc-400 font-normal">(≤300k ×2 / &gt;300k ×1.9)</span>
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-zinc-200">
            <span className="text-zinc-500 block font-medium">Prix sur demande</span>
            <span className="text-lg font-black text-amber-600 font-mono">
              {missingPriceCount}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-white border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filter === 'all'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Tous ({totalCount})
            </button>
            <button
              onClick={() => setFilter('no-image')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filter === 'no-image'
                  ? 'bg-[#D71920] text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Sans photo ({totalCount - withImageCount})
            </button>
            <button
              onClick={() => setFilter('no-price')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filter === 'no-price'
                  ? 'bg-[#D71920] text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Prix manquant ({missingPriceCount})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filter === 'flagged'
                  ? 'bg-[#D71920] text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Signalés ({flaggedCount})
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Rechercher référence, note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 text-xs text-zinc-900 placeholder-zinc-400 rounded-lg pl-7 pr-3 py-1.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Aucun élément ne correspond au critère sélectionné.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="p-3 bg-zinc-50 hover:bg-zinc-100/80 rounded-xl border border-zinc-200 flex items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-[9px] font-mono text-zinc-400">Sans</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#D71920] truncate">
                        {item.reference}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono bg-zinc-200/60 px-1.5 py-0.2 rounded">
                        Feuille: {item.sourceSheet} (ligne {item.sourceRow})
                      </span>
                    </div>
                    <span className="text-xs text-zinc-800 truncate block font-medium">{item.name}</span>
                    {item.issue && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5 font-bold">
                        {item.issue}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-zinc-900 block">
                    {item.formattedPrice}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {item.originalPriceAr
                      ? `Achat: ${item.originalPriceAr.toLocaleString()} Ar`
                      : 'Achat: Non spécifié'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
