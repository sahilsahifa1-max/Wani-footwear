import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types/index.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle search modal
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.audience.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.footwearType.toLowerCase().includes(q)
        );
      })
    : [];

  const shortcuts = ['Running', 'Chelsea Boot', 'School Shoes', 'Chunky Sneaker', 'Woolen Slipper'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search footwear by style, category, or occasion..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base text-zinc-900 bg-transparent placeholder-zinc-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-black rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Shortcuts if empty */}
        {!query.trim() && (
          <div className="p-6 space-y-4">
            <span className="text-xs uppercase tracking-wider font-mono text-zinc-400 block">
              Suggested Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {shortcuts.map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setQuery(sc)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-colors"
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query.trim() && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            {results.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                No footwear found matching "{query}".
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-zinc-100 flex items-center justify-between gap-4 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 p-1 shrink-0 flex items-center justify-center">
                      <ShoeSilhouette category={product.category} accentColor="#F5F000" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 group-hover:text-black font-display truncate">
                        {product.name}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {product.audience} · {product.footwearType}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono text-zinc-900 tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
