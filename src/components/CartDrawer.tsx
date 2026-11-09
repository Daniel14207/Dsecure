import React from 'react';
import { CartItem } from '../types/product';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white border-l border-zinc-200 flex flex-col h-full shadow-2xl text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-50 rounded-lg text-[#D71920]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">Mon Panier D SECURE</h3>
              <span className="text-xs text-zinc-500 font-medium">
                {totalItemsCount} {totalItemsCount > 1 ? 'articles sélectionnés' : 'article sélectionné'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-zinc-800 mb-1">Votre panier est vide</h4>
              <p className="text-xs text-zinc-500 max-w-xs mb-6 font-medium">
                Explorez nos caméras de surveillance, systèmes d'alarme et packs pour sécuriser vos locaux.
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                Parcourir le catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex gap-3 relative group"
              >
                {/* Thumb */}
                <div className="w-18 h-18 bg-white rounded-lg border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 text-center">Photo devis</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#D71920] font-black truncate block">
                      {item.product.reference}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 truncate leading-snug">
                      {item.product.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-zinc-800 mt-0.5 block">
                      {item.product.formattedPrice}
                    </span>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center bg-white border border-zinc-200 rounded-md p-0.5 text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 rounded text-zinc-600 font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-bold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-zinc-100 rounded text-zinc-600 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-black text-zinc-900">
                        {item.product.sellingPriceAr
                          ? formatAr(item.product.sellingPriceAr * item.quantity)
                          : 'Sur devis'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1 text-zinc-400 hover:text-red-600 transition-colors self-start"
                  title="Supprimer du panier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Totals */}
        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Sous-total articles</span>
                <span className="font-mono font-bold text-zinc-900">{formatAr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Livraison</span>
                <span className="text-emerald-700 font-bold">À convenir sur WhatsApp</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-200">
                <span>TOTAL ESTIMÉ</span>
                <span className="font-mono text-[#D71920]">{formatAr(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>VALIDER MA COMMANDE WHATSAPP</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-2 text-center text-xs text-zinc-500 hover:text-red-600 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
