import React, { useState } from 'react';
import { Product } from '../types/product';
import { X, ShoppingBag, ArrowUpRight, ShieldCheck, Check, Phone, AlertTriangle, Layers } from 'lucide-react';
import { formatAr } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectOrder: (product: Product, quantity: number) => void;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder,
  relatedProducts,
  onSelectProduct,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const lines = product.description ? product.description.split('\n').filter(Boolean) : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-zinc-950 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-md px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold text-[#D71920] tracking-wider">
              {product.category}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs font-mono text-zinc-400">Réf: {product.reference}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Fermer la fiche produit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery / Image Left */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-zinc-900/60 rounded-xl border border-zinc-800/80 p-6 flex items-center justify-center relative overflow-hidden">
              {product.image && !imageError ? (
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.reference}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                  <ShieldCheck className="w-16 h-16 text-zinc-700 mb-3" />
                  <span className="font-mono text-zinc-300 font-semibold">{product.reference}</span>
                  <p className="text-xs text-zinc-500 mt-2">
                    Photographie officielle issue du catalogue constructeur Hikvision.
                  </p>
                </div>
              )}

              {/* Tag / Quality Flag */}
              {product.issue && (
                <div className="absolute top-3 left-3 bg-amber-950/90 border border-amber-800 text-amber-300 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Note catalogue: {product.issue}</span>
                </div>
              )}
            </div>

            {/* Product Key Facts */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Authenticité</span>
                <span className="text-zinc-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" /> 100% Hikvision Original
                </span>
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Disponibilité</span>
                <span className="text-emerald-400 font-semibold">Madagascar & Régions</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Right */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 leading-snug">
                {product.name}
              </h2>

              <div className="font-mono text-sm text-[#D71920] font-semibold mb-4">
                SKU: {product.reference}
              </div>

              {/* Price Block */}
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-800 mb-6">
                <span className="text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                  Prix de vente D SECURE
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-white font-mono tabular-nums">
                    {product.formattedPrice}
                  </span>
                  {product.sellingPriceAr !== null && (
                    <span className="text-xs text-zinc-400">
                      (TVA comprise · Facturation conforme)
                    </span>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs uppercase font-bold text-zinc-300 tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#D71920]" />
                  Caractéristiques Techniques Officielles
                </h4>
                <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-900 max-h-48 overflow-y-auto space-y-1.5 text-xs text-zinc-300 leading-relaxed font-mono">
                  {lines.length > 0 ? (
                    lines.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#D71920] font-bold">›</span>
                        <span>{line}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 italic">Spécifications standard Hikvision.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase & Order Actions */}
            <div className="pt-4 border-t border-zinc-900 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-sm text-zinc-300">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-lg border border-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                  {addedToast ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Ajouté au panier !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </button>
              </div>

              {/* Order via WhatsApp */}
              <button
                onClick={() => onDirectOrder(product, quantity)}
                className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
              >
                <Phone className="w-4 h-4" />
                <span>Commander via WhatsApp (+261 33 75 565 84)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Footer */}
        {relatedProducts.length > 0 && (
          <div className="bg-zinc-900/50 p-6 border-t border-zinc-900">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-4">
              Produits complémentaires dans la même catégorie
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.slice(0, 4).map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    setQuantity(1);
                  }}
                  className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 text-left transition-colors flex flex-col justify-between"
                >
                  <span className="font-mono text-[11px] text-[#D71920] font-semibold truncate block">
                    {rel.reference}
                  </span>
                  <span className="text-xs text-zinc-200 line-clamp-1 my-1">
                    {rel.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                    {rel.formattedPrice}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
