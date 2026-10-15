import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types/index.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F7F2] shadow-2xl flex flex-col border-l border-zinc-200">
          {/* Header */}
          <div className="p-6 bg-white border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <h2 id="wishlist-title" className="text-xl font-bold font-display text-zinc-900">
                Saved Footwear
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#171717] text-[#F5F000] font-mono tabular-nums font-bold">
                {wishlistProducts.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-display text-zinc-800">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Save your favorite running shoes, boots, or heels to check them out later.
                </p>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex gap-4 items-center"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="w-20 h-20 rounded-xl bg-zinc-100 p-2 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <ShoeSilhouette category={p.category} accentColor="#F5F000" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="text-sm font-bold text-zinc-900 truncate font-display cursor-pointer hover:text-black"
                      >
                        {p.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveFromWishlist(p)}
                        className="text-zinc-400 hover:text-red-500 p-1"
                        aria-label={`Remove ${p.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs font-mono font-bold text-zinc-900 mt-1 tabular-nums">
                      ₹{p.price.toLocaleString('en-IN')}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(p, p.sizes[0] || 'Standard', p.colors[0]?.name || 'Standard');
                        onRemoveFromWishlist(p);
                      }}
                      className="mt-3 px-3 py-1.5 bg-[#171717] hover:bg-black text-[#F5F000] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
