import React from 'react';
import { MapPin, Clock, Phone, Mail, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { STORE_INFO } from '../config/storeInfo.ts';

interface FooterProps {
  onNavigate: (view: string, audience?: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#171717] text-white pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black tracking-tight font-display uppercase">
                Vani<span className="text-white">.</span><span className="bg-[#F5F000] text-[#171717] px-1.5 ml-0.5 rounded-sm">Footwear</span>
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Founded and managed by Bilal Ahmed Vani in Kanewan, Jammu & Kashmir. Providing comfortable, stylish, and high-quality footwear for all ages and occasions.
            </p>

            <div className="space-y-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F5F000] shrink-0" />
                <span>{STORE_INFO.location.address}, {STORE_INFO.location.displayLocation} (192124)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F5F000] shrink-0" />
                <span>{STORE_INFO.hours.display}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F5F000] shrink-0" />
                <a href={`tel:${STORE_INFO.contact.phone}`} className="hover:text-white">
                  {STORE_INFO.contact.displayPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Departments (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'men')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Men’s Running & Boots
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'women')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Women’s Active & Heels
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'kids')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Kids & School Shoes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'toddler')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Babies & Toddler Pre-Walkers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'seniors')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Senior Citizens & Comfort
                </button>
              </li>
            </ul>
          </div>

          {/* Experience & Store (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">
              Store & Services
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Our Story & Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Visit Kanewan Store
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('track')}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-[#F5F000] transition-colors cursor-pointer text-[#F5F000]"
                >
                  Bilal Ahmed Vani Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Local Trust & Scroll to top (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">
              Local Guarantee
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <span className="font-bold text-white block">Kanewan Community Shop</span>
              <p>Serving Jammu & Kashmir with 100% genuine footwear inspections.</p>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="p-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 text-[#F5F000]" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div>
            © {new Date().getFullYear()} Vani Footwear. Owned by Bilal Ahmed Vani. Main Market Kanewan, Jammu & Kashmir.
          </div>
          <div className="flex items-center gap-4">
            <span>7-Day Store Exchange</span>
            <span>·</span>
            <span>GST Registered</span>
            <span>·</span>
            <span>100% Quality Assured</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
