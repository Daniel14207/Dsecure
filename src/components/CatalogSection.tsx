import React, { useState, useMemo } from 'react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Image, AlertCircle } from 'lucide-react';

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
      result = result.filter((p) => p.category === activeSubCategory || p.sourceSheet === activeSubCategory);
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

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(0, page * pageSize);

  const handleSubCatClick = (cat: string) => {
    onSelectSubCategory(cat);
    setPage(1);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
          {subtitle}
        </p>
      </div>

      {/* Control Bar: Subcategories Tabs & Tools */}
      <div className="space-y-4 mb-8">
        {/* Subcategories Segmented Buttons */}
        {subCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {subCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSubCatClick(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  activeSubCategory === cat
                    ? 'bg-[#D71920] text-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Filter & Search Sub-row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-900">
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
              className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-xs text-zinc-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Tools: Image toggle & Sort */}
          <div className="flex items-center gap-3 text-xs">
            {/* Image toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200 select-none">
              <input
                type="checkbox"
                checked={onlyWithImage}
                onChange={(e) => {
                  setOnlyWithImage(e.target.checked);
                  setPage(1);
                }}
                className="rounded bg-zinc-900 border-zinc-700 text-[#D71920] focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-zinc-500" />
                <span>Avec photo</span>
              </span>
            </label>

            {/* Price sort */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300">
              <ArrowUpDown className="w-3 h-3 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="default" className="bg-zinc-900 text-white">Tri par défaut</option>
                <option value="price-asc" className="bg-zinc-900 text-white">Prix croissant</option>
                <option value="price-desc" className="bg-zinc-900 text-white">Prix décroissant</option>
              </select>
            </div>

            {/* Count indicator */}
            <span className="text-zinc-500 text-xs font-mono hidden sm:inline">
              {filteredProducts.length} {filteredProducts.length > 1 ? 'articles' : 'article'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-12 text-center text-zinc-400">
          <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Aucun produit ne correspond</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
            Essayez de réinitialiser la recherche ou de changer de sous-catégorie.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setOnlyWithImage(false);
              onSelectSubCategory('Tous');
            }}
            className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg border border-zinc-800 transition-colors"
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

      {/* Load More Button if remaining */}
      {paginatedProducts.length < filteredProducts.length && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setPage(page + 1)}
            className="py-3 px-8 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl border border-zinc-800 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>Afficher plus de produits ({filteredProducts.length - paginatedProducts.length} restants)</span>
          </button>
        </div>
      )}
    </section>
  );
};
