import React, { useState } from 'react';
import { Product } from '../types/product';
import { ShoppingBag, ArrowUpRight, ShieldCheck, AlertCircle, Eye, ShoppingCart } from 'lucide-react';

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
    ? product.description.split('\n')[0].slice(0, 100) + (product.description.length > 100 ? '...' : '')
    : 'Équipement certifié original Hikvision.';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1 shadow-xs hover:shadow-lg"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-zinc-50 p-4 flex items-center justify-center overflow-hidden border-b border-zinc-100">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={`${product.name} - ${product.reference}`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-contain p-2 group-hover:scale-108 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Graceful Fallback Container (Zero-Broken-Image Policy) */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 text-zinc-400 bg-zinc-50">
            <ShieldCheck className="w-10 h-10 text-zinc-300 mb-2 group-hover:text-[#D71920] transition-colors" />
            <span className="text-xs font-mono text-zinc-700 font-bold">{product.reference}</span>
            <span className="text-[10px] text-zinc-400 mt-1">Photo originale sur devis</span>
          </div>
        )}

        {/* Quiet top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-bold pointer-events-none">
          <span className="text-zinc-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs border border-zinc-200/80">
            {product.category}
          </span>
          {product.issue ? (
            <span
              className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1"
              title={product.issue}
            >
              <AlertCircle className="w-3 h-3 text-amber-600" />
              <span>À vérifier</span>
            </span>
          ) : (
            <span className="text-[#D71920] bg-red-50/90 px-1.5 py-0.5 rounded border border-red-100">
              Hikvision
            </span>
          )}
        </div>

        {/* Quick view button overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-zinc-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-200 flex items-center gap-1.5 shadow-md">
            <Eye className="w-3.5 h-3.5 text-[#D71920]" /> Fiche technique
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Reference SKU */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-mono text-xs font-black text-[#D71920] tracking-wider truncate">
              {product.reference}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {product.sourceSheet}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-extrabold text-zinc-900 group-hover:text-[#D71920] line-clamp-2 leading-snug transition-colors">
            {product.name}
          </h3>

          {/* Technical Specs Excerpt */}
          <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        {/* Pricing & Order Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                Prix unitaire TTC
              </span>
              <span className="text-base font-black text-zinc-950 font-mono tabular-nums">
                {product.formattedPrice}
              </span>
            </div>
            {product.sellingPriceAr !== null && (
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                Disponible
              </span>
            )}
          </div>

          {/* Quantity and Actions Bar */}
          <div className="flex items-center gap-2">
            {/* Stepper */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-zinc-100 border border-zinc-200 rounded-lg p-0.5 text-xs text-zinc-700"
            >
              <button
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded text-zinc-600 hover:text-black font-bold transition-colors"
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <span className="w-6 text-center font-mono font-bold text-zinc-900">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center hover:bg-white rounded text-zinc-600 hover:text-black font-bold transition-colors"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAdd}
              className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-lg transition-colors flex items-center justify-center"
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-700" />
            </button>

            {/* Direct WhatsApp Order - matching red button with cart icon from design reference */}
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-2 px-2.5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-red-700/20 active:scale-98"
              title="Commander via WhatsApp"
            >
              <ShoppingCart className="w-3.5 h-3.5 fill-white" />
              <span>COMMANDER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
