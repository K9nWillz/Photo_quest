import React from 'react';
import { MonsterShape } from '../types';

interface MonsterPinProps {
  shape: MonsterShape;
  color: string;
  name: string;
  minutes: number;
  completed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MonsterIcon: React.FC<{ shape: MonsterShape; color?: string; size?: number }> = ({
  shape,
  color = '#8b5cf6',
  size = 32,
}) => {
  const renderShape = () => {
    switch (shape) {
      case 'horns':
        return (
          <g>
            <path d="M22,25 Q12,12 8,20 Q12,38 24,34" fill={color} />
            <path d="M78,25 Q88,12 92,20 Q88,38 76,34" fill={color} />
            <ellipse cx="50" cy="58" rx="30" ry="24" fill={color} />
            <circle cx="40" cy="54" r="5" fill="#ffffff" />
            <circle cx="60" cy="54" r="5" fill="#ffffff" />
            <circle cx="40" cy="54" r="2.5" fill="#0f172a" />
            <circle cx="60" cy="54" r="2.5" fill="#0f172a" />
            <line x1="42" y1="68" x2="58" y2="68" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'ghost':
        return (
          <g>
            <path
              d="M24,78 L24,45 C24,25 76,25 76,45 L76,78 Q63,72 50,78 Q37,72 24,78 Z"
              fill={color}
            />
            <ellipse cx="40" cy="46" rx="4" ry="7" fill="#ffffff" />
            <ellipse cx="60" cy="46" rx="4" ry="7" fill="#ffffff" />
            <circle cx="40" cy="47" r="2" fill="#0f172a" />
            <circle cx="60" cy="47" r="2" fill="#0f172a" />
            <ellipse cx="50" cy="62" rx="4" ry="6" fill="#0f172a" />
          </g>
        );
      case 'square':
        return (
          <g>
            <rect x="24" y="24" width="52" height="52" rx="8" fill={color} />
            <rect x="34" y="42" width="10" height="8" rx="2" fill="#ffffff" />
            <rect x="56" y="42" width="10" height="8" rx="2" fill="#ffffff" />
            <rect x="36" y="44" width="5" height="5" fill="#0f172a" />
            <rect x="58" y="44" width="5" height="5" fill="#0f172a" />
            <line x1="38" y1="62" x2="62" y2="62" stroke="#0f172a" strokeWidth="3" />
          </g>
        );
      case 'spikes':
        return (
          <g>
            <polygon points="50,14 62,32 84,32 72,50 84,68 62,68 50,86 38,68 16,68 28,50 16,32 38,32" fill={color} />
            <circle cx="42" cy="48" r="4.5" fill="#ffffff" />
            <circle cx="58" cy="48" r="4.5" fill="#ffffff" />
            <circle cx="42" cy="48" r="2" fill="#0f172a" />
            <circle cx="58" cy="48" r="2" fill="#0f172a" />
            <path d="M44,60 Q50,65 56,60" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        );
      case 'drip':
        return (
          <g>
            <path
              d="M50,18 C65,35 78,55 78,68 C78,82 65,86 50,86 C35,86 22,82 22,68 C22,55 35,35 50,18 Z"
              fill={color}
            />
            <circle cx="42" cy="58" r="5" fill="#ffffff" />
            <circle cx="58" cy="58" r="5" fill="#ffffff" />
            <circle cx="42" cy="58" r="2" fill="#0f172a" />
            <circle cx="58" cy="58" r="2" fill="#0f172a" />
            <path d="M45,72 Q50,68 55,72" stroke="#0f172a" strokeWidth="2" fill="none" />
          </g>
        );
      case 'box':
        return (
          <g>
            <rect x="20" y="32" width="60" height="46" rx="4" fill={color} />
            <polygon points="18,32 50,18 82,32" fill={color} opacity="0.8" />
            <circle cx="38" cy="50" r="4.5" fill="#ffffff" />
            <circle cx="62" cy="50" r="4.5" fill="#ffffff" />
            <circle cx="38" cy="50" r="2" fill="#0f172a" />
            <circle cx="62" cy="50" r="2" fill="#0f172a" />
            <line x1="36" y1="64" x2="64" y2="64" stroke="#0f172a" strokeWidth="2.5" />
          </g>
        );
      case 'tall':
      default:
        return (
          <g>
            <rect x="34" y="16" width="32" height="70" rx="16" fill={color} />
            <circle cx="44" cy="38" r="4.5" fill="#ffffff" />
            <circle cx="56" cy="38" r="4.5" fill="#ffffff" />
            <circle cx="44" cy="38" r="2" fill="#0f172a" />
            <circle cx="56" cy="38" r="2" fill="#0f172a" />
            <ellipse cx="50" cy="54" rx="5" ry="3" fill="#0f172a" />
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="overflow-visible">
      {renderShape()}
    </svg>
  );
};

export const MonsterPin: React.FC<MonsterPinProps> = ({
  shape,
  color,
  name,
  minutes,
  completed = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center focus:outline-none transition-all duration-300 ${
        completed ? 'opacity-30 grayscale pointer-events-none scale-95' : 'hover:scale-110 active:scale-95'
      } ${className}`}
      aria-label={`${name}, estimated ${minutes} minutes`}
    >
      <div className="relative w-11 h-11 flex items-center justify-center rounded-full bg-[#1b1b26]/90 border border-white/20 shadow-lg backdrop-blur-sm">
        <MonsterIcon shape={shape} color={color} size={30} />
        {/* HP Badge showing estimated minutes */}
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500/90 text-white font-mono text-[9px] font-semibold border border-rose-300/30 shadow-sm leading-tight">
          {minutes}m
        </span>
      </div>
      <div className="mt-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-medium text-white/90 whitespace-nowrap shadow pointer-events-none tracking-tight">
        {name}
      </div>
    </button>
  );
};
