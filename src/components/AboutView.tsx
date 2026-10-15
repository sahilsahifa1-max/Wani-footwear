import React from 'react';
import {
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { STORE_INFO } from '../config/storeInfo.ts';
import { aboutImages } from '../config/aboutImages.ts';

interface AboutViewProps {
  onExploreShop: () => void;
  onVisitStore: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreShop, onVisitStore }) => {
  // Helper to render image or graceful architectural fallback
  const renderImageSlot = (
    url: string,
    alt: string,
    placeholderLabel: string,
    aspectRatio: string = 'aspect-[4/3]'
  ) => {
    if (url && url.trim().length > 0) {
      return (
        <div className={`relative w-full ${aspectRatio} rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/50 shadow-md group`}>
          <img
            src={url}
            alt={alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Hide broken image and reveal styled fallback
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      );
    }

    // Elegant architectural placeholder aligned with zero-pill & zero-broken-image constitution
    return (
      <div className={`relative w-full ${aspectRatio} rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-8 flex flex-col justify-between border border-zinc-700 shadow-md text-white`}>
        <div className="flex items-center justify-between">
          <span className="w-8 h-8 rounded-full bg-[#F5F000] text-[#171717] flex items-center justify-center font-bold text-xs">
            WF
          </span>
          <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            Kanelwan, J&K
          </span>
        </div>

        <div className="space-y-1">
          <ImageIcon className="w-6 h-6 text-[#F5F000] mb-2" />
          <h4 className="text-base font-bold font-display text-white">{placeholderLabel}</h4>
          <p className="text-xs text-zinc-400 font-sans">
            Configurable via <code className="text-[#F5F000] font-mono">src/config/aboutImages.ts</code>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      {/* Editorial Hero Header */}
      <section className="bg-[#171717] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-mono text-[#F5F000] uppercase tracking-wider">
            <span>Our Heritage & Purpose</span>
            <span>·</span>
            <span className="text-white">Kanelwan, Jammu & Kashmir</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight uppercase max-w-4xl leading-[1.05]">
            Footwear For Every Step Of Life<span className="text-[#F5F000]">.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-normal">
            Wani Footwear brings together footwear for different ages, styles, occasions, and budgets, with a focus on helping every customer find the right pair.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onExploreShop}
              className="px-8 py-3.5 bg-[#F5F000] text-[#171717] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ded900] transition-colors cursor-pointer font-display flex items-center gap-2"
            >
              <span>Explore The Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onVisitStore}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer font-display"
            >
              Visit Our Kanelwan Store
            </button>
          </div>
        </div>
      </section>

      {/* Narrative Section: Bilal Ahmed Wani & Kanelwan Store */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">
                The Founder’s Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900 tracking-tight">
                Founded by Bilal Ahmed Wani
              </h2>
            </div>

            <div className="space-y-4 text-base text-zinc-600 leading-relaxed">
              <p>
                In the historic market of Kanelwan, Jammu & Kashmir, Wani Footwear was built upon a straightforward principle: quality footwear should be accessible to everyone in our community, from toddlers taking their very first steps to elders seeking pain-free morning walks.
              </p>
              <p>
                Founder <strong>Bilal Ahmed Wani</strong> recognized that too often, customers had to choose between inflated designer prices or poorly made footwear that broke down after weeks. He established Wani Footwear to curate genuine, hard-wearing materials that withstand Kashmir’s rugged terrain and seasonal changes.
              </p>
              <p>
                Today, our shop stands open seven days a week from 8:00 AM to 8:00 PM, greeting neighbors and travelers alike with personalized size fittings, transparent advice, and dependable quality.
              </p>
            </div>

            {/* Pillar highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 font-display">Every Age Welcomed</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Infants, active kids, stylish youth, working professionals, and seniors.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 font-display">Honest Craftsmanship</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Every sole, stitch, and insole is hand-inspected before reaching customers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Slot: Owner Portrait */}
          <div className="lg:col-span-5">
            {renderImageSlot(
              aboutImages.ownerPortrait,
              'Bilal Ahmed Wani, Founder of Wani Footwear',
              'Founder: Bilal Ahmed Wani',
              'aspect-[4/5]'
            )}
          </div>
        </div>
      </section>

      {/* Visual Storefront & Interior Gallery Section */}
      <section className="bg-zinc-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">
                Visual Archive
              </span>
              <h2 className="text-3xl font-extrabold font-display text-zinc-900">
                Our Kanelwan Store Experience
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Open Daily: 8:00 AM – 8:00 PM
            </span>
          </div>

          {/* 3-Image Architectural Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              {renderImageSlot(
                aboutImages.storefront,
                'Wani Footwear Storefront in Kanelwan',
                'Kanelwan Storefront'
              )}
              <p className="text-xs text-zinc-500 mt-2 font-mono">Exterior · Main Market Kanelwan</p>
            </div>

            <div>
              {renderImageSlot(
                aboutImages.interior,
                'Wani Footwear Store Interior',
                'Curated Interior & Displays'
              )}
              <p className="text-xs text-zinc-500 mt-2 font-mono">Interior · Organized Size Shelving</p>
            </div>

            <div>
              {renderImageSlot(
                aboutImages.footwearDisplay,
                'Footwear Showcase at Wani Footwear',
                'Footwear Showcase'
              )}
              <p className="text-xs text-zinc-500 mt-2 font-mono">Close-up · Premium Suede & Leather</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Promise & Values */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#171717] bg-[#F5F000] px-3 py-1 rounded-full font-bold">
            The Wani Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-zinc-900">
            Four Commitments to Every Customer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
            <span className="text-2xl font-bold font-mono text-[#F5F000] bg-[#171717] w-10 h-10 rounded-xl flex items-center justify-center">
              01
            </span>
            <h3 className="text-base font-bold font-display text-zinc-900">True Value Pricing</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We eliminate unnecessary middlemen markups so our community gets the highest quality at fair, honest prices.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
            <span className="text-2xl font-bold font-mono text-[#F5F000] bg-[#171717] w-10 h-10 rounded-xl flex items-center justify-center">
              02
            </span>
            <h3 className="text-base font-bold font-display text-zinc-900">Tailored Size Fittings</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every foot is unique. We provide dedicated measuring support to ensure no tight toes or blisters.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
            <span className="text-2xl font-bold font-mono text-[#F5F000] bg-[#171717] w-10 h-10 rounded-xl flex items-center justify-center">
              03
            </span>
            <h3 className="text-base font-bold font-display text-zinc-900">7-Day Local Exchange</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Exchange unworn shoes easily at our Kanelwan store or by mail if the fit isn’t completely comfortable.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
            <span className="text-2xl font-bold font-mono text-[#F5F000] bg-[#171717] w-10 h-10 rounded-xl flex items-center justify-center">
              04
            </span>
            <h3 className="text-base font-bold font-display text-zinc-900">Community Respect</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Bilal Ahmed Wani and team take personal responsibility for every shoe that leaves our door.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
