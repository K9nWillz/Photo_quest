import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  className = '',
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER (VERIFIED)',
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.min(Math.max((x / rect.width) * 100, 2), 98);
    setSliderPos(clamped);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative select-none overflow-hidden rounded-2xl bg-zinc-950 border border-white/10 cursor-ew-resize touch-none ${className}`}
      style={{ height: '360px' }}
    >
      {/* After image (base) */}
      <img
        src={afterImage}
        alt="After cleaning"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono tracking-wider text-emerald-400 border border-emerald-500/20 pointer-events-none z-10">
        {afterLabel}
      </div>

      {/* Before image (clipped over) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before cleaning"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono tracking-wider text-zinc-300 border border-white/10 pointer-events-none z-10">
          {beforeLabel}
        </div>
      </div>

      {/* Slider divider line and handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none z-20"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-xl border border-black/20 text-xs font-mono font-bold tracking-tighter">
          ⟷
        </div>
      </div>
    </div>
  );
};
