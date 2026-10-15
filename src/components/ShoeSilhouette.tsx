import React from 'react';
import { FootwearCategory } from '../types/index.ts';

interface ShoeSilhouetteProps {
  category: FootwearCategory;
  accentColor?: string;
  className?: string;
}

export const ShoeSilhouette: React.FC<ShoeSilhouetteProps> = ({
  category,
  accentColor = '#F5F000',
  className = 'w-full h-full'
}) => {
  switch (category) {
    case 'running':
    case 'sports':
      return (
        <svg
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Sole Shadow */}
          <ellipse cx="200" cy="215" rx="150" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(6px)" />
          {/* Outsole */}
          <path
            d="M 50 185 Q 90 205 190 205 Q 310 205 365 175 C 375 170 365 155 350 155 Q 300 175 190 175 Q 90 175 60 160 Z"
            fill="#1E1E1E"
          />
          {/* Midsole Rebound Foam */}
          <path
            d="M 52 165 C 100 190 200 190 355 160 C 345 145 320 148 290 150 C 210 155 120 152 58 145 Z"
            fill={accentColor}
          />
          {/* Upper Body */}
          <path
            d="M 60 148 C 65 110 95 85 140 85 C 170 85 195 105 230 115 C 275 125 320 135 348 152 C 340 160 300 162 250 158 C 170 152 95 155 60 148 Z"
            fill="#272727"
          />
          {/* Collar & Tongue */}
          <path
            d="M 140 85 C 160 65 190 70 210 100 C 185 102 165 95 140 85 Z"
            fill="#171717"
          />
          {/* Dynamic Swoop / Velocity Stripe */}
          <path
            d="M 120 125 C 170 120 230 132 290 142 C 270 146 210 138 145 136 Z"
            fill={accentColor}
            opacity="0.9"
          />
          {/* Breathable Mesh Texture lines */}
          <line x1="240" y1="128" x2="260" y2="148" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1="260" y1="132" x2="280" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1="280" y1="136" x2="300" y2="152" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          {/* Lacing eyelets */}
          <circle cx="180" cy="98" r="3.5" fill="#FFFFFF" />
          <circle cx="198" cy="107" r="3.5" fill="#FFFFFF" />
          <circle cx="216" cy="116" r="3.5" fill="#FFFFFF" />
        </svg>
      );

    case 'boots':
      return (
        <svg
          viewBox="0 0 400 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <ellipse cx="200" cy="235" rx="140" ry="12" fill="rgba(0,0,0,0.18)" filter="blur(6px)" />
          {/* Chunky Commando Outsole */}
          <path
            d="M 70 205 L 350 205 C 360 205 365 195 355 185 L 340 185 L 180 185 L 75 185 C 65 195 65 205 70 205 Z"
            fill="#1A1A1A"
          />
          {/* Lug treads */}
          <rect x="95" y="205" width="22" height="8" rx="2" fill="#0D0D0D" />
          <rect x="135" y="205" width="22" height="8" rx="2" fill="#0D0D0D" />
          <rect x="175" y="205" width="22" height="8" rx="2" fill="#0D0D0D" />
          <rect x="255" y="205" width="22" height="8" rx="2" fill="#0D0D0D" />
          <rect x="295" y="205" width="22" height="8" rx="2" fill="#0D0D0D" />
          {/* Leather welt trim */}
          <path d="M 70 185 L 350 185 L 345 178 L 75 178 Z" fill="#78350F" />
          {/* Boot Shaft & Vamp */}
          <path
            d="M 115 65 L 175 65 C 180 85 190 120 220 135 L 315 150 C 345 155 350 178 335 178 L 85 178 C 80 160 85 110 115 65 Z"
            fill="#382214"
          />
          {/* Elastic Side Gore (Chelsea) */}
          <polygon points="135,75 160,75 152,140 142,140" fill="#1C1917" />
          {/* Pull Loop */}
          <path d="M 118 65 C 118 45 130 45 130 65" stroke={accentColor} strokeWidth="4" fill="none" />
          {/* Leather highlight */}
          <path
            d="M 230 140 C 270 146 310 156 325 168"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'formal':
    case 'loafers':
      return (
        <svg
          viewBox="0 0 400 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <ellipse cx="205" cy="195" rx="145" ry="10" fill="rgba(0,0,0,0.16)" filter="blur(5px)" />
          {/* Low profile Dress Sole */}
          <path
            d="M 70 170 Q 180 180 345 162 C 352 155 342 148 330 148 Q 180 155 80 150 C 72 152 68 165 70 170 Z"
            fill="#171717"
          />
          {/* Stacked Wooden Heel */}
          <rect x="75" y="165" width="40" height="15" rx="2" fill="#451A03" />
          {/* Sleek Cap-Toe Upper */}
          <path
            d="M 80 150 C 95 110 130 95 165 95 C 190 95 210 110 240 120 L 310 135 C 335 140 338 152 328 152 L 80 150 Z"
            fill="#211F1D"
          />
          {/* Cap Toe stitch line */}
          <path d="M 270 127 C 275 142 278 152 280 152" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="3 3" />
          {/* Oxford closed lacing */}
          <line x1="168" y1="102" x2="190" y2="108" stroke={accentColor} strokeWidth="2" />
          <line x1="172" y1="110" x2="194" y2="116" stroke={accentColor} strokeWidth="2" />
          <line x1="176" y1="118" x2="198" y2="124" stroke={accentColor} strokeWidth="2" />
        </svg>
      );

    case 'sandals':
    case 'slides':
    case 'slippers':
      return (
        <svg
          viewBox="0 0 400 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <ellipse cx="200" cy="175" rx="140" ry="10" fill="rgba(0,0,0,0.16)" filter="blur(5px)" />
          {/* Contoured Slide Sole */}
          <path
            d="M 65 155 C 110 168 280 168 340 150 C 345 140 335 132 320 134 C 270 140 120 140 80 135 C 65 138 60 148 65 155 Z"
            fill="#1E1E1E"
          />
          {/* Anatomical Footbed */}
          <path
            d="M 75 140 C 130 148 260 148 325 136 L 320 130 C 260 138 120 138 80 132 Z"
            fill="#D97706"
          />
          {/* Wide Padded Band Strap */}
          <path
            d="M 160 138 C 170 95 240 95 260 136 C 245 140 175 142 160 138 Z"
            fill={accentColor}
          />
          {/* Brand embossed groove on strap */}
          <path
            d="M 180 115 C 200 105 220 105 240 115"
            stroke="#171717"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'first-steps':
    case 'school-shoes':
    case 'comfort-walking':
    default:
      return (
        <svg
          viewBox="0 0 400 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          <ellipse cx="200" cy="205" rx="135" ry="10" fill="rgba(0,0,0,0.16)" filter="blur(5px)" />
          {/* Sole */}
          <path
            d="M 65 180 Q 150 195 335 170 C 342 162 335 152 320 152 Q 180 162 75 155 C 65 158 60 172 65 180 Z"
            fill="#1F2937"
          />
          {/* Supportive Cushion Layer */}
          <path
            d="M 70 165 Q 160 175 325 155 L 320 148 Q 160 165 75 155 Z"
            fill={accentColor}
          />
          {/* Comfort Upper with Padded Collar */}
          <path
            d="M 80 155 C 88 120 120 105 160 105 C 190 105 210 120 235 130 L 295 142 C 315 146 322 155 315 155 L 80 155 Z"
            fill="#374151"
          />
          {/* Gentle Velcro / Elastic Strap */}
          <rect x="160" y="112" width="55" height="18" rx="6" fill="#111827" />
          <circle cx="205" cy="121" r="4" fill={accentColor} />
        </svg>
      );
  }
};
