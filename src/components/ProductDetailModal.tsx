import React, { useState } from 'react';
import { Product } from '../types/product';
import { X, ShoppingBag, ArrowUpRight, ShieldCheck, Check, Phone, AlertTriangle, ShoppingCart } from 'lucide-react';
import { formatAr, getDirectWhatsAppUrl } from '../utils/whatsapp';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white border border-zinc-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black text-[#D71920] tracking-wider">
              {product.category}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs font-mono font-bold text-zinc-500">Réf: {product.reference}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            aria-label="Fermer la fiche produit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery / Image Left */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-zinc-50 rounded-xl border border-zinc-200 p-6 flex items-center justify-center relative overflow-hidden">
              {product.image && !imageError ? (
                <img
                  src={product.image}
                  alt={`${product.name} - ${product.reference}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                  <ShieldCheck className="w-16 h-16 text-zinc-300 mb-3" />
                  <span className="font-mono text-zinc-700 font-bold">{product.reference}</span>
                  <p className="text-xs text-zinc-500 mt-2 font-medium">
                    Photo officielle sur demande · Équipement certifié original Hikvision.
                  </p>
                </div>
              )}
            </div>

            {/* Product Key Facts */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 block mb-1 font-medium">Authenticité</span>
                <span className="text-zinc-900 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" /> 100% Original
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-500 block mb-1 font-medium">Disponibilité</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> En stock / Sur commande
                </span>
              </div>
            </div>
          </div>

          {/* Details & Actions Right */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Product Reference */}
              <div className="font-mono text-xs font-black text-[#D71920] mb-1">
                {product.reference}
              </div>

              {/* Product Name */}
              <h2 className="text-xl sm:text-2xl font-black text-[#080808] leading-tight">
                {product.name}
              </h2>

              {/* Price Display */}
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                    Prix public de vente
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#080808] font-mono tabular-nums">
                    {product.formattedPrice}
                  </span>
                </div>
                {product.sellingPriceAr ? (
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Garantie & Support inclus
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Sur devis personnalisé
                  </span>
                )}
              </div>

              {/* Technical Specifications Breakdown */}
              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                  Caractéristiques & Spécifications
                </h3>
                <div className="space-y-2 text-xs text-zinc-700 max-h-48 overflow-y-auto pr-2">
                  {lines.map((line, index) => (
                    <div key={index} className="flex items-start gap-2 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                      <span className="text-[#D71920] font-black shrink-0">•</span>
                      <span className="leading-relaxed">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ordering Controls */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-1 text-sm">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-zinc-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white rounded font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </button>
              </div>

              {/* Direct WhatsApp Order */}
              <button
                onClick={() => onDirectOrder(product, quantity)}
                className="w-full py-3.5 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-red-700/20"
              >
                <ShoppingCart className="w-4 h-4 fill-white" />
                <span>Commander immédiatement via WhatsApp</span>
              </button>

              {addedToast && (
                <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-center text-xs font-bold animate-fade-in">
                  ✓ Produit ajouté au panier avec succès !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Footer inside Modal */}
        {relatedProducts.length > 0 && (
          <div className="p-6 bg-zinc-50 border-t border-zinc-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-4">
              Produits complémentaires dans la même catégorie
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onSelectProduct(rel);
                    setImageError(false);
                    setQuantity(1);
                  }}
                  className="p-2.5 rounded-lg bg-white border border-zinc-200 hover:border-[#D71920] cursor-pointer transition-all shadow-xs"
                >
                  <div className="aspect-square bg-zinc-50 rounded mb-2 flex items-center justify-center overflow-hidden">
                    {rel.image ? (
                      <img src={rel.image} alt={rel.name} className="h-full w-full object-contain p-1" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-zinc-300" />
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-[#D71920] font-bold block truncate">
                    {rel.reference}
                  </span>
                  <span className="text-xs font-bold text-zinc-900 block truncate">{rel.name}</span>
                  <span className="text-xs font-bold text-zinc-800 font-mono mt-1 block">
                    {rel.formattedPrice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
