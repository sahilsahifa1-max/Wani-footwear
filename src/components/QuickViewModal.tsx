import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types/index.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onViewFullDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewFullDetails
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [accentColor, setAccentColor] = useState<string>('#F5F000');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0]?.name || '');
      setAccentColor(product.colors[0]?.hex || '#F5F000');
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 grid grid-cols-1 md:grid-cols-2"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Column */}
        <div className="bg-[#171717] p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 blur-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
            }}
          />
          <div className="relative w-full aspect-square flex items-center justify-center p-4">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-xl"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fallback = (e.currentTarget.parentElement as HTMLElement)?.querySelector('.quickview-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'block';
                }}
              />
            ) : null}
            <div className={`w-full h-full ${product.images && product.images.length > 0 ? 'quickview-fallback hidden' : 'block'}`}>
              <ShoeSilhouette category={product.category} accentColor={accentColor} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-[#F5F000]" />
            <span>Category: {product.footwearType}</span>
          </div>
        </div>

        {/* Product Selection Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-500">
                {product.audience} Collection
              </span>
              <h2 id="quick-view-title" className="text-2xl font-bold font-display text-zinc-900 mt-1">
                {product.name}
              </h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#171717] tabular-nums font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-zinc-400 line-through tabular-nums font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {product.inStock ? `In Stock (${product.stockCount} pairs)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-sm text-zinc-600 line-clamp-3">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Color: <span className="font-normal text-zinc-500">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        setAccentColor(c.hex);
                      }}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        selectedColor === c.name
                          ? 'ring-2 ring-[#171717] ring-offset-2 scale-110 border-white'
                          : 'border-zinc-300 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Select Size:
                </label>
                <span className="text-xs text-zinc-500 font-mono">Standard India / UK</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#171717] text-[#F5F000] border-[#171717]'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-mono font-bold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-1 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAdd}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !product.inStock
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#171717] text-[#F5F000] hover:bg-black active:scale-[0.99]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full py-2.5 text-xs text-zinc-600 hover:text-black font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Specification & Sizing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
