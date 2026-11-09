import React from 'react';
import { CartItem } from '../types/product';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatAr } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product.sellingPriceAr || 0) * item.quantity;
  }, 0);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
      <div
        className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-900 rounded-lg text-[#D71920]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mon Panier D SECURE</h3>
              <span className="text-xs text-zinc-400">
                {totalItemsCount} {totalItemsCount > 1 ? 'articles sélectionnés' : 'article sélectionné'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-zinc-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-zinc-300 mb-1">Votre panier est vide</h4>
              <p className="text-xs text-zinc-500 max-w-xs mb-6">
                Explorez nos caméras de surveillance, systèmes d'alarme et packs pour sécuriser vos locaux.
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg border border-zinc-800 transition-colors"
              >
                Parcourir le catalogue
              </button>
            </div>
          ) : (
            items.map((item) => {
              const lineTotal = item.product.sellingPriceAr
                ? item.product.sellingPriceAr * item.quantity
                : null;

              return (
                <div
                  key={item.product.id}
                  className="bg-zinc-900/50 rounded-xl p-3.5 border border-zinc-800/80 flex gap-3.5 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-zinc-700" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[11px] text-[#D71920] font-semibold truncate block">
                        {item.product.reference}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Supprimer l'article"
                        aria-label="Supprimer cet article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-medium text-white line-clamp-1">
                      {item.product.name}
                    </h4>

                    <div className="text-xs text-zinc-400 font-mono mt-0.5">
                      {formatAr(item.product.sellingPriceAr)} / unité
                    </div>

                    {/* Stepper & Line Total */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/60">
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded p-0.5 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                          aria-label="Diminuer la quantité"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono text-white tabular-nums">
                        {formatAr(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Sous-total équipements</span>
                <span className="font-mono text-white tabular-nums">{formatAr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Livraison & Installation</span>
                <span className="text-emerald-400">Sur devis technique</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-900">
                <span>Total estimé (Ar)</span>
                <span className="text-base font-mono text-[#D71920] tabular-nums">
                  {formatAr(subtotal)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
              >
                <span>Procéder à la commande WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <button
                  onClick={onClose}
                  className="hover:text-white transition-colors underline"
                >
                  Continuer mes achats
                </button>
                <button
                  onClick={onClearCart}
                  className="hover:text-red-400 transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
