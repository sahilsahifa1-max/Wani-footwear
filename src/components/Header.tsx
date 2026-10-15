import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../config/storeInfo.ts';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop All' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Visit Store' },
    { id: 'track', label: 'Track Order' }
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="bg-[#171717] text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F5F000]" />
            <span className="font-medium text-white">{STORE_INFO.location.displayLocation}</span>
            <span className="text-zinc-500 hidden sm:inline">·</span>
            <span className="text-zinc-400 hidden sm:inline">{STORE_INFO.hours.display}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="hidden md:inline text-zinc-400">Free Kanewan Store Pickup · 100% Genuine Quality</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#F5F000] hover:underline flex items-center gap-1 font-sans text-xs cursor-pointer"
              title="Store Owner Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#F7F7F2]/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left cursor-pointer group whitespace-nowrap shrink-0"
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] font-display uppercase group-hover:text-black transition-colors">
              Vani<span className="text-[#171717]">.</span><span className="bg-[#F5F000] text-[#171717] px-1.5 ml-0.5 rounded-sm">Footwear</span>
            </span>
          </button>

          {/* Zone 2: 4-5 Clean Nav Links (Single line, whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-700">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive ? 'text-[#171717] font-semibold' : 'hover:text-[#171717]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F000]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action Zone (Search, Wishlist, Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Icon Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Search catalogue"
              title="Search footwear"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon Button */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#171717] text-[#F5F000] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Primary Action: Shopping Bag Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-[#171717] text-white hover:bg-black rounded-xl transition-all cursor-pointer shadow-sm group whitespace-nowrap shrink-0"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#F5F000] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Bag</span>
              <span className="w-5 h-5 rounded-full bg-[#F5F000] text-[#171717] text-xs font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-[#F7F7F2] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left text-lg font-display font-medium py-2 border-b border-zinc-200/60 ${
                    activeView === link.id ? 'text-[#171717] font-bold pl-2 border-l-2 border-l-[#F5F000]' : 'text-zinc-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-left text-sm font-medium text-zinc-500 py-2 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#171717]" />
                <span>Bilal Ahmed Vani Store Management</span>
              </button>
            </div>
            <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-500 flex justify-between">
              <span>Kanewan, J&K</span>
              <span>8 AM – 8 PM</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
