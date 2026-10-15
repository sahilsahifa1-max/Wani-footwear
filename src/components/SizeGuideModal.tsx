import React, { useEffect } from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const adultSizes = [
    { uk: 'UK 6', eu: 'EU 40', us: 'US 7', cm: '25.0 cm' },
    { uk: 'UK 7', eu: 'EU 41', us: 'US 8', cm: '25.8 cm' },
    { uk: 'UK 8', eu: 'EU 42', us: 'US 9', cm: '26.7 cm' },
    { uk: 'UK 9', eu: 'EU 43', us: 'US 10', cm: '27.5 cm' },
    { uk: 'UK 10', eu: 'EU 44', us: 'US 11', cm: '28.3 cm' },
    { uk: 'UK 11', eu: 'EU 45', us: 'US 12', cm: '29.2 cm' }
  ];

  const womenSizes = [
    { uk: 'UK 3', eu: 'EU 36', us: 'US 5', cm: '22.5 cm' },
    { uk: 'UK 4', eu: 'EU 37', us: 'US 6', cm: '23.3 cm' },
    { uk: 'UK 5', eu: 'EU 38', us: 'US 7', cm: '24.1 cm' },
    { uk: 'UK 6', eu: 'EU 39', us: 'US 8', cm: '25.0 cm' },
    { uk: 'UK 7', eu: 'EU 40', us: 'US 9', cm: '25.8 cm' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#171717]" />
            <h2 className="text-xl font-bold font-display text-zinc-900">
              Wani Footwear Size Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-black rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* How to measure */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
          <span className="font-bold text-zinc-900 uppercase tracking-wider block font-display">
            How to Measure Your Foot at Home
          </span>
          <p>
            1. Place a piece of white paper on a hard floor with one edge against a wall.
          </p>
          <p>
            2. Stand with your heel against the wall and mark the furthest point of your longest toe with a pencil.
          </p>
          <p>
            3. Measure the distance in centimeters from the wall to your mark, and find your corresponding UK size below.
          </p>
        </div>

        {/* Men's Size Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-zinc-900">
            Men’s & Unisex Footwear (Standard India / UK)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-100 text-zinc-700">
                <tr>
                  <th className="p-2.5 rounded-l-lg font-bold">India / UK</th>
                  <th className="p-2.5">Euro</th>
                  <th className="p-2.5">US</th>
                  <th className="p-2.5 rounded-r-lg">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {adultSizes.map((r) => (
                  <tr key={r.uk} className="hover:bg-zinc-50">
                    <td className="p-2.5 font-bold text-zinc-900">{r.uk}</td>
                    <td className="p-2.5 text-zinc-600">{r.eu}</td>
                    <td className="p-2.5 text-zinc-600">{r.us}</td>
                    <td className="p-2.5 text-zinc-600">{r.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Women's Size Table */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-zinc-900">
            Women’s Footwear (India / UK)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-100 text-zinc-700">
                <tr>
                  <th className="p-2.5 rounded-l-lg font-bold">India / UK</th>
                  <th className="p-2.5">Euro</th>
                  <th className="p-2.5">US</th>
                  <th className="p-2.5 rounded-r-lg">Foot Length (CM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {womenSizes.map((r) => (
                  <tr key={r.uk} className="hover:bg-zinc-50">
                    <td className="p-2.5 font-bold text-zinc-900">{r.uk}</td>
                    <td className="p-2.5 text-zinc-600">{r.eu}</td>
                    <td className="p-2.5 text-zinc-600">{r.us}</td>
                    <td className="p-2.5 text-zinc-600">{r.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#171717] text-[#F5F000] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
        >
          Got It, Back to Shoe
        </button>
      </div>
    </div>
  );
};
