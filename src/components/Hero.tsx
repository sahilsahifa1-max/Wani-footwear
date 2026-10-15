import React, { useState } from 'react';
import { ArrowUpRight, MapPin, Compass, Shield, Sparkles } from 'lucide-react';
import { ShoeCanvas3D } from './ShoeCanvas3D.tsx';
import { STORE_INFO } from '../config/storeInfo.ts';

interface HeroProps {
  onExploreClick: () => void;
  onVisitStoreClick: () => void;
  onSelectAudience: (audience: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onVisitStoreClick,
  onSelectAudience
}) => {
  const [heroShoeColor, setHeroShoeColor] = useState('#F5F000');

  const audienceCategories = [
    { id: 'men', label: 'Men’s Collection', count: '7 Styles' },
    { id: 'women', label: 'Women’s Collection', count: '5 Styles' },
    { id: 'kids', label: 'Kids & School', count: '3 Styles' },
    { id: 'toddler', label: 'Babies & Toddlers', count: '3 Styles' },
    { id: 'seniors', label: 'Senior Comfort', count: '2 Styles' }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#171717] text-white">
      {/* Dramatic Black and Electric Yellow split geometric backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#F5F000] blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-zinc-800 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Top Kicker Label */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-[#F5F000]" />
            <span className="uppercase tracking-widest">{STORE_INFO.location.displayLocation}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-[#F5F000]">8:00 AM – 8:00 PM</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>FOUNDER: {STORE_INFO.ownerName.toUpperCase()}</span>
            <span>·</span>
            <span>PREMIUM FOOTWEAR ARCHIVE</span>
          </div>
        </div>

        {/* Hero Grid Split Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Big Editorial Typography & Intentional CTAs */}
          <div className="lg:col-span-6 space-y-8 z-10">
            <div className="space-y-4">
              <span className="inline-block text-xs uppercase tracking-[0.25em] font-mono text-[#F5F000] font-semibold">
                Autonomous Footwear Architecture
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display uppercase leading-[0.95] text-balance">
                Every Step<span className="text-[#F5F000]">.</span>
                <br />
                <span className="text-zinc-300">Your Style</span>
                <span className="text-[#F5F000]">.</span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed text-pretty">
              {STORE_INFO.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onExploreClick}
                className="px-8 py-4 bg-[#F5F000] text-[#171717] font-semibold text-sm uppercase tracking-wider rounded-xl hover:bg-[#ded900] transition-all transform active:scale-95 shadow-lg shadow-yellow-500/10 flex items-center gap-2 cursor-pointer font-display"
              >
                <span>Explore Collections</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onVisitStoreClick}
                className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-medium text-sm uppercase tracking-wider rounded-xl border border-white/15 transition-all cursor-pointer font-display flex items-center gap-2"
              >
                <span>Visit Our Store</span>
                <Compass className="w-4 h-4 text-[#F5F000]" />
              </button>
            </div>

            {/* Quality & Locality Proof Points */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold font-display text-white tabular-nums">100%</div>
                <div className="text-xs text-zinc-400 mt-0.5">Genuine Quality</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-[#F5F000] tabular-nums">All Ages</div>
                <div className="text-xs text-zinc-400 mt-0.5">Infants to Seniors</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-white tabular-nums">Kanelwan</div>
                <div className="text-xs text-zinc-400 mt-0.5">Daily 8 AM–8 PM</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Shoe Canvas Viewer */}
          <div className="lg:col-span-6 relative">
            <ShoeCanvas3D primaryColor={heroShoeColor} onColorChange={setHeroShoeColor} />
            
            {/* Context Floating Tag */}
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono px-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F5F000]" />
                Featured: Wani Velocity Pro Runner
              </span>
              <span>Available in UK 6–11</span>
            </div>
          </div>
        </div>

        {/* Quick Audience Category Strip */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">
              Curated Departments
            </span>
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              Select an age or style to filter instantly
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {audienceCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectAudience(cat.id)}
                className="p-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-left transition-all group cursor-pointer"
              >
                <div className="text-sm font-semibold text-white group-hover:text-[#F5F000] transition-colors">
                  {cat.label}
                </div>
                <div className="text-xs text-zinc-400 font-mono mt-1">
                  {cat.count}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
