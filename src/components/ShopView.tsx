import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Product, ProductFilter, Audience, FootwearCategory } from '../types/index.ts';
import { filterProducts, sortProducts } from '../utils/filterRules.ts';
import { ProductCard } from './ProductCard.tsx';

interface ShopViewProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onSelectProduct: (product: Product) => void;
  initialAudience?: string;
  initialCategory?: string;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onSelectProduct,
  initialAudience = 'all',
  initialCategory = 'all'
}) => {
  const [filter, setFilter] = useState<ProductFilter>({
    searchQuery: '',
    audience: (initialAudience as Audience) || 'all',
    category: (initialCategory as FootwearCategory) || 'all',
    size: 'all',
    color: 'all',
    priceMin: 0,
    priceMax: 5000,
    inStockOnly: false,
    sortBy: 'featured'
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Audiences
  const audiences: { id: Audience | 'all'; label: string }[] = [
    { id: 'all', label: 'All Footwear' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'kids', label: 'Kids' },
    { id: 'toddler', label: 'Babies & Toddlers' },
    { id: 'seniors', label: 'Senior Comfort' }
  ];

  // Categories
  const categories: { id: FootwearCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'running', label: 'Running & Training' },
    { id: 'sneakers', label: 'Casual Sneakers' },
    { id: 'chunky-sneakers', label: 'Chunky Streetwear' },
    { id: 'boots', label: 'Boots & Trail' },
    { id: 'formal', label: 'Formals & Oxfords' },
    { id: 'sandals', label: 'Sandals & Heels' },
    { id: 'slides', label: 'Slides & Recovery' },
    { id: 'slippers', label: 'Slippers & House' },
    { id: 'ethnic', label: 'Ethnic & Jutti' },
    { id: 'school-shoes', label: 'School Uniform' },
    { id: 'first-steps', label: 'First-Steps & Pre-Walker' },
    { id: 'comfort-walking', label: 'Orthopedic & Easy-Fit' }
  ];

  // Collect unique sizes
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    const list = filterProducts(products, filter);
    return sortProducts(list, filter.sortBy);
  }, [products, filter]);

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      audience: 'all',
      category: 'all',
      size: 'all',
      color: 'all',
      priceMin: 0,
      priceMax: 5000,
      inStockOnly: false,
      sortBy: 'featured'
    });
  };

  const hasActiveFilters =
    filter.searchQuery !== '' ||
    filter.audience !== 'all' ||
    filter.category !== 'all' ||
    filter.size !== 'all' ||
    filter.inStockOnly ||
    filter.priceMax < 5000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Editorial Header Section */}
      <div className="mb-10 pb-8 border-b border-zinc-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500">
              <span>Vani Footwear Catalogue</span>
              <span>·</span>
              <span className="text-zinc-800 font-semibold">{filteredProducts.length} Pairs Available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-[#171717] uppercase">
              Footwear For Every Step
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
              Explore performance runners, artisan leather boots, school shoes, and soothing comfort slippers. Inspected and curated at our Kanewan shop in Jammu & Kashmir.
            </p>
          </div>

          {/* Quick Clear Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Audience Segmented Filter Bar (Button tabs as allowed in Section 1.A of frontend-design) */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {audiences.map((aud) => {
            const isActive = filter.audience === aud.id;
            return (
              <button
                key={aud.id}
                type="button"
                onClick={() => setFilter({ ...filter, audience: aud.id })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer font-display uppercase tracking-wider ${
                  isActive
                    ? 'bg-[#171717] text-[#F5F000] shadow-sm'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200/80'
                }`}
              >
                {aud.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Filter Panel + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <span className="text-sm font-bold font-display uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#F5F000] fill-black" />
              Refine Shoes
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-zinc-500 hover:text-black font-mono underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="e.g. Runner, Chelsea, Slide..."
                value={filter.searchQuery}
                onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              {filter.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilter({ ...filter, searchQuery: '' })}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
              Category
            </label>
            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter({ ...filter, category: c.id })}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    filter.category === c.id
                      ? 'bg-[#171717] text-[#F5F000] font-semibold'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Size
              </label>
              {filter.size !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter({ ...filter, size: 'all' })}
                  className="text-[11px] text-zinc-400 hover:text-black font-mono"
                >
                  All sizes
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {allSizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter({ ...filter, size: filter.size === s ? 'all' : s })}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                    filter.size === s
                      ? 'bg-[#171717] text-[#F5F000] border-[#171717] font-bold'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-700 uppercase tracking-wider">Max Price</span>
              <span className="font-mono font-bold text-zinc-900 tabular-nums">
                ₹{filter.priceMax.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="5000"
              step="100"
              value={filter.priceMax}
              onChange={(e) => setFilter({ ...filter, priceMax: Number(e.target.value) })}
              className="w-full accent-[#171717] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>₹400</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="pt-2 border-t border-zinc-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
              <input
                type="checkbox"
                checked={filter.inStockOnly}
                onChange={(e) => setFilter({ ...filter, inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded text-[#171717] focus:ring-[#F5F000]"
              />
              <span>In-Stock Pairs Only</span>
            </label>
          </div>
        </aside>

        {/* Right Content Column (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Toolbar: Mobile filter trigger + Sort by dropdown */}
          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#F5F000]" />
              <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>

            {/* Product Counter */}
            <div className="text-xs text-zinc-500 font-mono">
              Showing <strong className="text-zinc-900">{filteredProducts.length}</strong> styles
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <label htmlFor="shop-sort" className="text-xs font-semibold text-zinc-600 uppercase tracking-wider hidden sm:inline">
                Sort:
              </label>
              <select
                id="shop-sort"
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as ProductFilter['sortBy'] })}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-800 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display text-zinc-900">
                No matching footwear found
              </h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                Try widening your price range, clearing specific sizes, or searching for other categories.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#171717] text-[#F5F000] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onClick={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Up Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-zinc-900">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-zinc-500 hover:text-black rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="e.g. runner, boots..."
                  value={filter.searchQuery}
                  onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              {/* Audience */}
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Audience
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {audiences.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setFilter({ ...filter, audience: a.id })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        filter.audience === a.id ? 'bg-[#171717] text-[#F5F000]' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFilter({ ...filter, category: c.id })}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                        filter.category === c.id ? 'bg-[#171717] text-[#F5F000] font-bold' : 'text-zinc-600'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom apply CTA */}
              <div className="pt-4 border-t border-zinc-200 flex gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-800 text-xs font-bold uppercase rounded-xl"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-[#171717] text-[#F5F000] text-xs font-bold uppercase rounded-xl"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
