import React, { useState } from 'react';
import { Product } from '../types/product';
import { ShoppingBag, ArrowUpRight, ShieldCheck, AlertCircle, Eye } from 'lucide-react';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelect: (product: Product) => void;
  onDirectOrder: (product: Product, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelect,
  onDirectOrder,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(quantity + 1);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectOrder(product, quantity);
  };

  // Truncate technical spec to clean preview
  const shortDescription = product.description
    ? product.description.split('\n')[0].slice(0, 110) + (product.description.length > 110 ? '...' : '')
    : 'Équipement professionnel certifié Hikvision.';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-zinc-950 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-0.5 shadow-sm hover:shadow-md"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-zinc-900/60 p-4 flex items-center justify-center overflow-hidden border-b border-zinc-900">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={`${product.name} - ${product.reference}`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Graceful Fallback Container (Zero-Broken-Image Policy) */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 text-zinc-600 bg-zinc-900/40">
            <ShieldCheck className="w-10 h-10 text-zinc-700 mb-2 group-hover:text-[#D71920] transition-colors" />
            <span className="text-xs font-mono text-zinc-400 font-semibold">{product.reference}</span>
            <span className="text-[11px] text-zinc-600 mt-1">Photo officielle sur devis</span>
          </div>
        )}

        {/* Quiet top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium pointer-events-none">
          <span className="text-zinc-400 bg-zinc-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-800/80">
            {product.category}
          </span>
          {product.issue ? (
            <span
              className="text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-900/80 flex items-center gap-1"
              title={product.issue}
            >
              <AlertCircle className="w-3 h-3" />
              <span>À vérifier</span>
            </span>
          ) : (
            <span className="text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-900">
              Hikvision
            </span>
          )}
        </div>

        {/* Quick view button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-zinc-900/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" /> Fiche technique
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Reference SKU */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-xs font-semibold text-[#D71920] tracking-wider truncate">
              {product.reference}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Réf. {product.sourceSheet}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Technical Specs Excerpt */}
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        {/* Pricing & Order Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-900">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
                Prix public TTC
              </span>
              <span className="text-base font-bold text-white font-mono tabular-nums">
                {product.formattedPrice}
              </span>
            </div>
            {product.sellingPriceAr !== null && (
              <span className="text-[11px] text-emerald-400 font-medium">
                En stock
              </span>
            )}
          </div>

          {/* Quantity and Actions Bar */}
          <div className="flex items-center gap-2">
            {/* Stepper */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs text-zinc-300"
            >
              <button
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span className="w-6 text-center font-mono font-semibold text-white">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 rounded-lg transition-colors flex items-center justify-center"
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Order */}
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-1.5 px-2.5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
              title="Commander directement via WhatsApp"
            >
              <span>Commander</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
