import React, { useState } from 'react';
import {
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  RotateCcw,
  Shield,
  Ruler,
  Check,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Product } from '../types/index.ts';
import { ShoeSilhouette } from './ShoeSilhouette.tsx';
import { STORE_INFO } from '../config/storeInfo.ts';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onBackToShop: () => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onBackToShop,
  onOpenSizeGuide
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [accentColor, setAccentColor] = useState<string>(product.colors[0]?.hex || '#F5F000');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'materials' | 'delivery'>('desc');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.audience === product.audience))
    .slice(0, 3);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Breadcrumb & Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap">
        <button
          type="button"
          onClick={onBackToShop}
          className="hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </button>
        <span>/</span>
        <span className="uppercase">{product.audience}</span>
        <span>/</span>
        <span className="uppercase">{product.category}</span>
        <span>/</span>
        <span className="text-zinc-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Left Gallery + Right Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Gallery & Visual Presentation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full aspect-[4/3] sm:aspect-square bg-[#171717] rounded-3xl p-8 sm:p-12 flex items-center justify-center overflow-hidden border border-zinc-200/50 shadow-inner">
            {/* Dynamic Ambient Background Glow */}
            <div
              className="absolute inset-0 opacity-25 blur-3xl pointer-events-none transition-colors duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 65%)`
              }}
            />

            <div className="relative w-full h-full flex items-center justify-center z-10">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                    const fallback = (e.currentTarget.parentElement as HTMLElement)?.querySelector('.silhouette-pdp-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'block';
                  }}
                />
              ) : null}
              <div className={`w-full h-full ${product.images && product.images.length > 0 ? 'silhouette-pdp-fallback hidden' : 'block'}`}>
                <ShoeSilhouette category={product.category} accentColor={accentColor} />
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              {product.badge && (
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-[#F5F000] text-[#171717] rounded-md">
                  {product.badge}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-mono font-bold tracking-wider px-3 py-1 bg-white text-[#171717] rounded-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`absolute top-4 right-4 z-20 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Colorway Thumbnails */}
          {product.colors.length > 1 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                Available Variations ({product.colors.length})
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setSelectedColor(c.name);
                      setAccentColor(c.hex);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-[#171717] bg-white ring-2 ring-black shadow-sm'
                        : 'border-zinc-200 bg-white/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span className="text-xs font-medium text-zinc-800 truncate">{c.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Accordion / Tabs */}
          <div className="pt-6 border-t border-zinc-200">
            <div className="flex items-center gap-6 border-b border-zinc-200 text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`pb-3 relative transition-colors cursor-pointer ${
                  activeTab === 'desc' ? 'text-[#171717] font-bold' : 'text-zinc-500 hover:text-black'
                }`}
              >
                Overview & Story
                {activeTab === 'desc' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F000]" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('materials')}
                className={`pb-3 relative transition-colors cursor-pointer ${
                  activeTab === 'materials' ? 'text-[#171717] font-bold' : 'text-zinc-500 hover:text-black'
                }`}
              >
                Materials & Care
                {activeTab === 'materials' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F000]" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('delivery')}
                className={`pb-3 relative transition-colors cursor-pointer ${
                  activeTab === 'delivery' ? 'text-[#171717] font-bold' : 'text-zinc-500 hover:text-black'
                }`}
              >
                Kanelwan Pickup & Shipping
                {activeTab === 'delivery' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F000]" />}
              </button>
            </div>

            <div className="py-5 text-sm text-zinc-600 leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <p className="text-xs text-zinc-500 font-mono">
                    Audience: <span className="text-zinc-800 capitalize">{product.audience}</span> · Type: <span className="text-zinc-800">{product.footwearType}</span>
                  </p>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-3">
                  {product.material && (
                    <div>
                      <span className="font-semibold text-zinc-800 block">Upper Composition:</span>
                      <span>{product.material}</span>
                    </div>
                  )}
                  {product.sole && (
                    <div>
                      <span className="font-semibold text-zinc-800 block">Sole Architecture:</span>
                      <span>{product.sole}</span>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <span className="font-semibold text-zinc-800 block">Care & Maintenance:</span>
                      <span>{product.careInstructions}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="space-y-3">
                  <p className="font-semibold text-zinc-900">
                    Same-Day Pickup at Kanelwan Store (8 AM – 8 PM): Free
                  </p>
                  <p>
                    Local Kashmir Valley Delivery: ₹49 (Free on orders above ₹999). Usually delivered in 1–2 days.
                  </p>
                  <p>
                    Pan-India Shipping: ₹99 (Free on orders above ₹1,499).
                  </p>
                  <p className="text-xs text-zinc-500">
                    All orders are inspected and boxed at our Main Market Kanelwan store by Bilal Ahmed Wani and team.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                {product.audience} Collection
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
                product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              }`}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : 'Sold Out'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-zinc-900">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500">
              {product.tagline}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2 border-t border-zinc-100">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#171717] tabular-nums font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-zinc-400 line-through tabular-nums font-mono">
                  ₹{product.originalPrice!.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  Save ₹{(product.originalPrice! - product.price).toLocaleString('en-IN')}
                </span>
              </>
            )}
            <span className="text-[11px] text-zinc-400 block font-mono">GST 12% included</span>
          </div>

          {/* Size Selector */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Select Size (India / UK)
              </span>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="text-xs text-zinc-600 hover:text-black font-semibold flex items-center gap-1 underline transition-colors cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-[#171717]" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                    selectedSize === s
                      ? 'bg-[#171717] text-[#F5F000] border-[#171717] shadow-sm'
                      : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
            <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Quantity
            </span>
            <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-5 py-1.5 text-xs font-mono font-bold tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                className="px-3.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-bold transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleAdd}
              className={`w-full py-4 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !product.inStock
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : isAddedFeedback
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#171717] text-[#F5F000] hover:bg-black active:scale-[0.99] shadow-md'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className="w-full py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider bg-[#F5F000] hover:bg-[#ded900] text-[#171717] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now (Instant Checkout)</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-zinc-100 space-y-2.5 text-xs text-zinc-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#171717] shrink-0" />
              <span>Pickup at Kanelwan Store or Express Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#171717] shrink-0" />
              <span>{STORE_INFO.policies.returns}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#171717] shrink-0" />
              <span>Verified genuine pair inspected by Bilal Ahmed Wani</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-display text-zinc-900">
              Related Footwear
            </h2>
            <button
              type="button"
              onClick={onBackToShop}
              className="text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-xl bg-zinc-100 flex items-center justify-center p-2 shrink-0">
                  <ShoeSilhouette category={rel.category} accentColor="#F5F000" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">{rel.audience}</div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-black truncate font-display">
                    {rel.name}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#171717] mt-1 tabular-nums">
                    ₹{rel.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
