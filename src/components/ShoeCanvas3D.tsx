import React, { useRef, useEffect, useState } from 'react';
import { Rotate3d, Sparkles, Eye } from 'lucide-react';

interface ShoeCanvas3DProps {
  primaryColor?: string;
  onColorChange?: (color: string) => void;
}

export const ShoeCanvas3D: React.FC<ShoeCanvas3DProps> = ({
  primaryColor = '#F5F000',
  onColorChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const angleRef = useRef(0.2);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [activeColor, setActiveColor] = useState(primaryColor);

  const colors = [
    { name: 'Volt Electric', hex: '#F5F000' },
    { name: 'Stealth Black', hex: '#171717' },
    { name: 'Glacier White', hex: '#F7F7F2' }
  ];

  const handleColorSelect = (hex: string) => {
    setActiveColor(hex);
    if (onColorChange) onColorChange(hex);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (isAutoRotating && !isDragging) {
        angleRef.current += 0.008;
        if (angleRef.current > Math.PI * 2) {
          angleRef.current -= Math.PI * 2;
        }
      }
      const currentAngle = angleRef.current;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + 15;
      const scale = Math.min(width, height) * 0.42;

      // Dynamic 3D perspective calculation
      const cosA = Math.cos(currentAngle);
      const sinA = Math.sin(currentAngle);

      // Floor Shadow with dynamic depth
      ctx.save();
      ctx.beginPath();
      const shadowRadiusX = scale * 1.05 + Math.abs(cosA) * 15;
      const shadowRadiusY = 16 + Math.abs(sinA) * 6;
      ctx.ellipse(centerX, centerY + scale * 0.46, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.filter = 'blur(10px)';
      ctx.fill();
      ctx.restore();

      // Draw 3D Sneaker Geometry Projection
      ctx.save();
      ctx.translate(centerX, centerY);

      // Subtle dynamic float bob
      const floatY = Math.sin(currentAngle * 2) * 8;
      ctx.translate(0, floatY);

      // Draw Outsole (Bottom profile)
      ctx.beginPath();
      const soleLeft = -scale * 0.9 * cosA - 30 * sinA;
      const soleRight = scale * 0.9 * cosA + 30 * sinA;
      const soleY = scale * 0.28;

      ctx.moveTo(soleLeft, soleY);
      ctx.bezierCurveTo(
        soleLeft * 0.5,
        soleY + 30 + sinA * 10,
        soleRight * 0.5,
        soleY + 25 - sinA * 10,
        soleRight,
        soleY - 15
      );
      ctx.bezierCurveTo(
        soleRight - 20,
        soleY - 35,
        soleLeft * 0.3,
        soleY - 20,
        soleLeft,
        soleY
      );
      ctx.fillStyle = '#0f0f0f';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#282828';
      ctx.stroke();

      // Draw Midsole with Active Accent Color (Rebound cushion)
      ctx.beginPath();
      ctx.moveTo(soleLeft + 5, soleY - 5);
      ctx.bezierCurveTo(
        soleLeft * 0.4,
        soleY - 10,
        soleRight * 0.4,
        soleY - 15,
        soleRight - 10,
        soleY - 25
      );
      ctx.bezierCurveTo(
        soleRight - 20,
        soleY - 50,
        soleLeft * 0.2,
        soleY - 45,
        soleLeft + 15,
        soleY - 30
      );
      ctx.fillStyle = activeColor;
      ctx.fill();

      // Outsole grip lines
      ctx.strokeStyle = activeColor === '#F5F000' ? '#171717' : '#FFFFFF';
      ctx.lineWidth = 1.5;
      for (let i = -3; i <= 3; i++) {
        const xPos = (scale * 0.2 * i) * cosA;
        ctx.beginPath();
        ctx.moveTo(xPos - 10, soleY - 12);
        ctx.lineTo(xPos + 10, soleY + 8);
        ctx.stroke();
      }

      // Upper Shoe Silhouette with 3D Depth
      ctx.beginPath();
      const toeX = soleRight - 25;
      const toeY = soleY - 35;
      const heelX = soleLeft + 20;
      const heelY = soleY - 50;
      const collarX = soleLeft * 0.3;
      const collarY = -scale * 0.35;

      ctx.moveTo(heelX, heelY);
      // Heel counter curve
      ctx.bezierCurveTo(heelX - 15, heelY - 60, collarX - 30, collarY + 20, collarX, collarY);
      // Ankle collar
      ctx.bezierCurveTo(collarX + 30, collarY - 10, collarX + 60, collarY + 25, collarX + 70, collarY + 50);
      // Instep & Tongue
      ctx.bezierCurveTo(collarX + 110, collarY + 80, toeX - 50, toeY - 25, toeX, toeY);
      // Toe cap back to heel
      ctx.bezierCurveTo(toeX - 30, toeY + 15, heelX + 40, heelY + 15, heelX, heelY);

      // Gradient shading based on angle
      const upperGrad = ctx.createLinearGradient(heelX, collarY, toeX, toeY);
      upperGrad.addColorStop(0, '#1c1c1c');
      upperGrad.addColorStop(0.5, '#2e2e2e');
      upperGrad.addColorStop(1, '#181818');
      ctx.fillStyle = upperGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dynamic Speed Swoop Accent
      ctx.beginPath();
      ctx.moveTo(collarX + 30, collarY + 70);
      ctx.bezierCurveTo(collarX + 80, collarY + 85, toeX - 60, toeY - 10, toeX - 25, toeY);
      ctx.bezierCurveTo(toeX - 50, toeY + 5, collarX + 50, collarY + 95, collarX + 30, collarY + 70);
      ctx.fillStyle = activeColor;
      ctx.globalAlpha = 0.95;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Lacing & Eyestays
      ctx.strokeStyle = activeColor === '#F5F000' ? '#FFFFFF' : '#F5F000';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) {
        const lx1 = collarX + 35 + i * 16;
        const ly1 = collarY + 45 + i * 10;
        const lx2 = collarX + 50 + i * 16;
        const ly2 = collarY + 35 + i * 10;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();
      }

      // Wani Brand Mark on Sneaker Heel
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px "Space Grotesk", sans-serif';
      ctx.fillText('WANI', heelX + 15, heelY - 20);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAutoRotating, isDragging, activeColor]);

  // Touch and Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    angleRef.current += deltaX * 0.01;
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    angleRef.current += deltaX * 0.01;
    setStartX(e.touches[0].clientX);
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1c] via-[#141414] to-[#0a0a0a] border border-[#2a2a2a] shadow-2xl">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 70%)`
        }}
      />

      {/* Floating Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs text-zinc-300">
        <Sparkles className="w-3.5 h-3.5 text-[#F5F000]" />
        <span className="font-medium tracking-wide">3D Interactive Viewer</span>
        <span className="text-zinc-500">·</span>
        <span className="text-zinc-400">Drag to Orbit</span>
      </div>

      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="w-full h-full max-w-[620px] max-h-[460px] object-contain cursor-grab active:cursor-grabbing z-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        aria-label="3D Interactive Sneaker Model"
      />

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-black/75 border border-white/10 backdrop-blur-md">
        {/* Color Palette Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono hidden sm:inline">Colorways</span>
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorSelect(c.hex)}
                className={`w-6 h-6 rounded-full border transition-transform duration-200 ${
                  activeColor === c.hex ? 'scale-110 ring-2 ring-[#F5F000] ring-offset-2 ring-offset-black border-white' : 'border-zinc-700 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={`Select ${c.name}`}
              />
            ))}
          </div>
        </div>

        {/* Rotation & View Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isAutoRotating
                ? 'bg-[#F5F000] text-[#171717]'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>{isAutoRotating ? 'Auto Orbit ON' : 'Paused'}</span>
          </button>

          <button
            type="button"
            onClick={() => { angleRef.current = 0.3; }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            title="Reset to 3/4 Front View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
