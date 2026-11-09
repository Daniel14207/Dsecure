import React, { useState, useMemo } from 'react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { Search, ArrowUpDown, Image, AlertCircle } from 'lucide-react';

interface CatalogSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  subCategories: string[];
  activeSubCategory: string;
  onSelectSubCategory: (cat: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onDirectOrder: (product: Product, quantity: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  title,
  subtitle,
  products,
  subCategories,
  activeSubCategory,
  onSelectSubCategory,
  onAddToCart,
  onSelectProduct,
  onDirectOrder,
  searchQuery,
  onSearchChange,
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [onlyWithImage, setOnlyWithImage] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Subcategory filter
    if (activeSubCategory !== 'Tous') {
      result = result.filter(
        (p) => p.category === activeSubCategory
      );
    }

    // Only with image toggle
    if (onlyWithImage) {
      result = result.filter((p) => p.image !== null);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.reference.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => {
        const pa = a.sellingPriceAr ?? Number.MAX_SAFE_INTEGER;
        const pb = b.sellingPriceAr ?? Number.MAX_SAFE_INTEGER;
        return pa - pb;
      });
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => {
        const pa = a.sellingPriceAr ?? -1;
        const pb = b.sellingPriceAr ?? -1;
        return pb - pa;
      });
    }

    return result;
  }, [products, activeSubCategory, onlyWithImage, searchQuery, sortBy]);

  const paginatedProducts = filteredProducts.slice(0, page * pageSize);

  const handleSubCatClick = (cat: string) => {
    onSelectSubCategory(cat);
    setPage(1);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#080808] tracking-tight uppercase">
          {title}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Control Bar: Subcategories Tabs & Tools */}
      <div className="space-y-4 mb-8">
        {/* Subcategories Segmented Buttons */}
        {subCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {subCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSubCatClick(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  activeSubCategory === cat
                    ? 'bg-[#D71920] text-white shadow-sm'
                    : 'bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Filter & Search Sub-row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200">
          {/* Search box inside catalog */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <input
              type="text"
              placeholder="Filtrer par modèle (ex: DS-2CD...), nom, spec..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white text-xs text-zinc-900 placeholder-zinc-400 rounded-lg pl-8 pr-7 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920] shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2.5 text-xs font-bold text-zinc-400 hover:text-zinc-700"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Tools: Image toggle & Sort */}
          <div className="flex items-center gap-3 text-xs">
            {/* Image toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-zinc-600 hover:text-zinc-900 select-none bg-white border border-zinc-200 px-3 py-2 rounded-lg shadow-xs">
              <input
                type="checkbox"
                checked={onlyWithImage}
                onChange={(e) => {
                  setOnlyWithImage(e.target.checked);
                  setPage(1);
                }}
                className="rounded border-zinc-300 text-[#D71920] focus:ring-0"
              />
              <span className="flex items-center gap-1 font-semibold">
                <Image className="w-3.5 h-3.5 text-zinc-500" />
                <span>Avec photo</span>
              </span>
            </label>

            {/* Price sort */}
            <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-zinc-700 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="default">Tri par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            {/* Count indicator */}
            <span className="text-zinc-500 text-xs font-mono font-bold hidden sm:inline">
              {filteredProducts.length} {filteredProducts.length > 1 ? 'articles' : 'article'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-500 shadow-xs">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 mb-1">Aucun produit ne correspond</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
            Essayez de réinitialiser la recherche ou de changer de sous-catégorie.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setOnlyWithImage(false);
              onSelectSubCategory('Tous');
            }}
            className="py-2.5 px-5 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onSelect={onSelectProduct}
              onDirectOrder={onDirectOrder}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setPage(page + 1)}
            className="py-3 px-8 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-black uppercase tracking-wider rounded-xl border border-zinc-200 transition-colors shadow-xs inline-flex items-center gap-2 hover:border-[#D71920]"
          >
            <span>Afficher plus ({filteredProducts.length - paginatedProducts.length} restants)</span>
          </button>
        </div>
      )}
    </section>
  );
};
