import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types/index.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  onClick
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [activeAccentHex, setActiveAccentHex] = useState<string>(product.colors[0]?.hex || '#F5F000');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, selectedSize, selectedColor);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1600);
  };

  const handleColorChange = (e: React.MouseEvent, colorName: string, colorHex: string) => {
    e.stopPropagation();
    setSelectedColor(colorName);
    setActiveAccentHex(colorHex);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Media Canvas Area (Leading with 65-75% imagery on neutral backdrop) */}
      <div className="relative w-full aspect-[4/3] bg-zinc-100 flex items-center justify-center p-6 overflow-hidden">
        {/* Real Product Image with Fallback Silhouette */}
        <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-md"
              loading="lazy"
              onError={(e) => {
                // Hide image if file not yet uploaded and show vector silhouette
                (e.currentTarget as HTMLElement).style.display = 'none';
                const fallback = (e.currentTarget.parentElement as HTMLElement)?.querySelector('.silhouette-fallback');
                if (fallback) (fallback as HTMLElement).style.display = 'block';
              }}
            />
          ) : null}
          <div className={`w-full h-full ${product.images && product.images.length > 0 ? 'silhouette-fallback hidden' : 'block'}`}>
            <ShoeSilhouette category={product.category} accentColor={activeAccentHex} />
          </div>
        </div>

        {/* Badges / Text kicker (Quiet, no pill sandwiches) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#171717] text-white rounded">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-red-600 text-white rounded">
              Out of Stock
            </span>
          )}
          {hasDiscount && product.inStock && (
            <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 bg-[#F5F000] text-[#171717] rounded">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
            isWishlisted
              ? 'bg-red-50 text-red-500 shadow-sm'
              : 'bg-white/80 hover:bg-white text-zinc-600 hover:text-black'
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-[#171717]/90 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-lg backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-[#F5F000]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Category & Audience */}
        <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span className="uppercase tracking-wider">{product.audience} · {product.footwearType}</span>
          <span className="text-zinc-400">{product.sizes.length} sizes</span>
        </div>

        {/* Product Title */}
        <h3 className="text-base font-bold text-zinc-900 group-hover:text-black transition-colors line-clamp-1 font-display">
          {product.name}
        </h3>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => handleColorChange(e, c.name, c.hex)}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  selectedColor === c.name
                    ? 'ring-2 ring-black scale-110 border-white'
                    : 'border-zinc-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Color ${c.name}`}
              />
            ))}
            <span className="text-[11px] text-zinc-400 ml-1 truncate">{selectedColor}</span>
          </div>
        )}

        {/* Price & Add to Cart Baseline */}
        <div className="pt-2 mt-auto border-t border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#171717] tabular-nums font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through tabular-nums font-mono">
                ₹{product.originalPrice!.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              !product.inStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : isAddedFeedback
                ? 'bg-emerald-600 text-white'
                : 'bg-[#171717] text-[#F5F000] hover:bg-black active:scale-95'
            }`}
            aria-label={`Add ${product.name} to cart`}
            title={product.inStock ? 'Add to cart' : 'Out of stock'}
          >
            {isAddedFeedback ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
