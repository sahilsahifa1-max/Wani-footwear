import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, FulfilmentType, OrderStatus } from './types/index.ts';
import { INITIAL_PRODUCTS } from './data/products.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { ShopView } from './components/ShopView.tsx';
import { ProductDetailView } from './components/ProductDetailView.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { WishlistDrawer } from './components/WishlistDrawer.tsx';
import { QuickViewModal } from './components/QuickViewModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { SizeGuideModal } from './components/SizeGuideModal.tsx';
import { CheckoutView } from './components/CheckoutView.tsx';
import { OrderConfirmationView } from './components/OrderConfirmationView.tsx';
import { OrderTrackingView } from './components/OrderTrackingView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { ContactView } from './components/ContactView.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { STORE_INFO } from './config/storeInfo.ts';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  // --- Persistent State from localStorage ---
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vani_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vani_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vani_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vani_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- UI Navigation State ---
  const [activeView, setActiveView] = useState<string>('home');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [initialAudienceFilter, setInitialAudienceFilter] = useState<string>('all');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // --- Modals & Drawers ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // --- Cart Configurations ---
  const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>('store-pickup');
  const [couponCode, setCouponCode] = useState<string>('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('vani_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('vani_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('vani_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('vani_orders', JSON.stringify(orders));
  }, [orders]);

  // URL Hash Synchronizer for back/forward navigation & deep links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'shop', 'about', 'contact', 'track', 'checkout'].includes(hash)) {
        setActiveView(hash);
      } else if (hash.startsWith('product-')) {
        const prodId = hash.replace('product-', '');
        const p = products.find((item) => item.id === prodId || item.slug === prodId);
        if (p) {
          setActiveProduct(p);
          setActiveView('product-detail');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  const navigateTo = (view: string, audience?: string) => {
    setActiveView(view);
    if (audience) {
      setInitialAudienceFilter(audience);
    }
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Cart Management Handlers ---
  const handleAddToCart = (
    product: Product,
    selectedSize: string = '',
    selectedColor: string = '',
    quantity: number = 1
  ) => {
    const size = selectedSize || product.sizes[0] || 'Standard';
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color}-${Date.now()}`,
        productId: product.id,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleBuyNow = (
    product: Product,
    size: string,
    color: string,
    quantity: number
  ) => {
    handleAddToCart(product, size, color, quantity);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Wishlist Management ---
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // --- Order Completion Handler ---
  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // clear cart
    setLastCompletedOrder(newOrder);
    setActiveView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Admin Handlers ---
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status,
          timeline: [
            ...o.timeline,
            {
              status,
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              note: `Status updated to ${status} by Kanewan store.`
            }
          ]
        };
      })
    );
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  // Featured Picks for Homepage
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2] text-[#171717] font-sans">
      {/* Top Bar Header */}
      <Header
        activeView={activeView}
        setActiveView={navigateTo}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOMEPAGE */}
        {activeView === 'home' && (
          <div className="space-y-16 sm:space-y-24">
            {/* Cinematic Hero */}
            <Hero
              onExploreClick={() => navigateTo('shop')}
              onVisitStoreClick={() => navigateTo('contact')}
              onSelectAudience={(aud) => {
                setInitialAudienceFilter(aud);
                navigateTo('shop', aud);
              }}
            />

            {/* Featured Footwear Collection */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                    Hand-Selected by Bilal Ahmed Vani
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-[#171717]">
                    Featured Archive
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('shop')}
                  className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-[#171717] hover:text-black group cursor-pointer"
                >
                  <span>Explore Full Catalogue ({products.length} Styles)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlistIds.includes(p.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={(prod) => setQuickViewProduct(prod)}
                    onAddToCart={(prod, sz, clr) => handleAddToCart(prod, sz, clr, 1)}
                    onClick={(prod) => {
                      setActiveProduct(prod);
                      navigateTo(`product-${prod.id}`);
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Electric Yellow Promotional Brand Banner */}
            <section className="bg-[#F5F000] text-[#171717] py-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <span className="text-xs uppercase tracking-widest font-mono font-bold px-3 py-1 bg-black text-[#F5F000] rounded-md inline-block">
                    Locally Owned · Kanewan, J&K
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight leading-tight">
                    Every Age. Every Occasion. Every Budget.
                  </h3>
                  <p className="text-base sm:text-lg text-zinc-800 max-w-2xl font-normal leading-relaxed">
                    From toddler first-step pre-walkers and durable school shoes to elegant wedding heels, waterproof boots, and orthopedic walking slip-ons.
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo('shop')}
                    className="w-full py-4 bg-[#171717] hover:bg-black text-[#F5F000] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer font-display text-center"
                  >
                    View All Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('contact')}
                    className="w-full py-4 bg-white/60 hover:bg-white text-zinc-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-black/10 cursor-pointer font-display text-center"
                  >
                    Find Our Kanewan Store
                  </button>
                </div>
              </div>
            </section>

            {/* Kanewan Local Store Spotlight Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                      Visit Us In Person
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900 tracking-tight">
                      Experience Footwear Fitting at Our Kanewan Store
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                    Located in Main Market Kanewan, Vani Footwear provides personal foot measurements and fitting assistance. Walk in anytime to try on pairs, feel the cushion, and find your exact match.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <span className="text-zinc-400 block uppercase">Hours</span>
                      <strong className="text-zinc-900 text-sm block mt-1">Every day, 8:00 AM – 8:00 PM</strong>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                      <span className="text-zinc-400 block uppercase">Location</span>
                      <strong className="text-zinc-900 text-sm block mt-1">Main Market, Kanewan, J&K</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => navigateTo('contact')}
                      className="px-6 py-3.5 bg-[#171717] hover:bg-black text-[#F5F000] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer font-display"
                    >
                      Store Directions & Hours
                    </button>
                    <a
                      href={`tel:${STORE_INFO.contact.phone}`}
                      className="px-6 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors font-display"
                    >
                      Call: {STORE_INFO.contact.displayPhone}
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-zinc-900 p-8 text-white space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#F5F000]">Kanewan Community Pillar</span>
                    <MapPin className="w-5 h-5 text-[#F5F000]" />
                  </div>
                  <h4 className="text-xl font-bold font-display">
                    Managed with Pride by Bilal Ahmed Vani
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    "Every customer who walks into Vani Footwear deserves comfortable, long-lasting shoes that fit their budget and lifestyle."
                  </p>
                  <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                    Pin Code: 192124 · Anantnag District · Jammu & Kashmir
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SHOP CATALOGUE */}
        {activeView === 'shop' && (
          <ShopView
            products={products}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p, sz, clr) => handleAddToCart(p, sz, clr, 1)}
            onSelectProduct={(p) => {
              setActiveProduct(p);
              navigateTo(`product-${p.id}`);
            }}
            initialAudience={initialAudienceFilter}
          />
        )}

        {/* VIEW 3: DEDICATED PRODUCT DETAIL VIEW */}
        {activeView === 'product-detail' && activeProduct && (
          <ProductDetailView
            product={activeProduct}
            allProducts={products}
            isWishlisted={wishlistIds.includes(activeProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={(p) => {
              setActiveProduct(p);
              navigateTo(`product-${p.id}`);
            }}
            onBackToShop={() => navigateTo('shop')}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          />
        )}

        {/* VIEW 4: CHECKOUT */}
        {activeView === 'checkout' && (
          <CheckoutView
            items={cartItems}
            fulfilmentType={fulfilmentType}
            couponCode={couponCode}
            onBackToCart={() => {
              setIsCartOpen(true);
              navigateTo('shop');
            }}
            onOrderComplete={handleOrderComplete}
          />
        )}

        {/* VIEW 5: ORDER CONFIRMATION */}
        {activeView === 'confirmation' && lastCompletedOrder && (
          <OrderConfirmationView
            order={lastCompletedOrder}
            onContinueShopping={() => navigateTo('shop')}
            onTrackOrder={(id) => navigateTo('track')}
          />
        )}

        {/* VIEW 6: ORDER TRACKING */}
        {activeView === 'track' && (
          <OrderTrackingView
            orders={orders}
            initialOrderId={lastCompletedOrder?.id}
            onExploreMore={() => navigateTo('shop')}
          />
        )}

        {/* VIEW 7: ABOUT US */}
        {activeView === 'about' && (
          <AboutView
            onExploreShop={() => navigateTo('shop')}
            onVisitStore={() => navigateTo('contact')}
          />
        )}

        {/* VIEW 8: CONTACT US */}
        {activeView === 'contact' && <ContactView />}
      </main>

      {/* Persistent Footer */}
      <Footer onNavigate={navigateTo} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* --- DRAWERS & MODALS --- */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        fulfilmentType={fulfilmentType}
        onSelectFulfilment={setFulfilmentType}
        couponCode={couponCode}
        onApplyCoupon={setCouponCode}
        onClearCoupon={() => setCouponCode('')}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p, sz, clr) => handleAddToCart(p, sz, clr, 1)}
        onSelectProduct={(p) => {
          setActiveProduct(p);
          navigateTo(`product-${p.id}`);
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, sz, clr, qty) => handleAddToCart(p, sz, clr, qty)}
        onViewFullDetails={(p) => {
          setActiveProduct(p);
          navigateTo(`product-${p.id}`);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setActiveProduct(p);
          navigateTo(`product-${p.id}`);
        }}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
