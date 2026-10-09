import React from 'react';
import { AvatarType, EquipmentId, EquipmentItem } from '../types';

interface AvatarProps {
  type: AvatarType;
  equippedItem?: EquipmentId;
  size?: number;
  className?: string;
  showHalo?: boolean;
  showAccountRing?: boolean;
}

export const AVATAR_OPTIONS: { id: AvatarType; name: string; description: string }[] = [
  { id: 'fox', name: 'Fox', description: 'Angular faceted amber geometry' },
  { id: 'owl', name: 'Owl', description: 'Concentric observant dusk rings' },
  { id: 'whale', name: 'Whale', description: 'Deep ocean hydrodynamic curvature' },
  { id: 'cactus', name: 'Cactus', description: 'Radial jade spires and nodes' },
  { id: 'comet', name: 'Comet', description: 'High-velocity violet streak' },
  { id: 'lotus', name: 'Lotus', description: 'Equilateral petal symmetry' },
  { id: 'geode', name: 'Geode', description: 'Crystalline subterranean angles' },
  { id: 'ember', name: 'Ember', description: 'Kinetic solar heat particles' },
  { id: 'frost', name: 'Frost', description: 'Hexagonal cryo lattice' },
  { id: 'moss', name: 'Moss', description: 'Organic undulating lichen forms' },
];

export const EQUIPMENT_ITEMS: EquipmentItem[] = [
  { id: 'cap', name: 'Tactical Cap', cost: 100, description: 'Streamlined athletic visor', tier: 'Common' },
  { id: 'shades', name: 'Cyber Shades', cost: 120, description: 'Polarized tactical lenses', tier: 'Common' },
  { id: 'tophat', name: 'Vintage Top Hat', cost: 150, description: 'Formal cylindrical headpiece', tier: 'Common' },
  { id: 'bandana', name: 'Neon Bandana', cost: 180, description: 'Vibrant wrapped dust protector', tier: 'Rare' },
  { id: 'beret', name: 'Architect Beret', cost: 200, description: 'Minimalist felt artist cap', tier: 'Rare' },
  { id: 'headset', name: 'Studio Headset', cost: 250, description: 'Acoustic monitoring perimeter', tier: 'Rare' },
  { id: 'fedora', name: 'Explorer Fedora', cost: 280, description: 'Field expedition brimmed hat', tier: 'Rare' },
  { id: 'helmet', name: 'Hazard Helmet', cost: 300, description: 'Armored protective shell', tier: 'Epic' },
  { id: 'visor', name: 'Holo Visor', cost: 350, description: 'Augmented HUD scanning band', tier: 'Epic' },
  { id: 'crown', name: 'Sovereign Crown', cost: 400, description: 'Prismatic aurum sovereign crest', tier: 'Epic' },
  { id: 'halo', name: 'Celestial Halo', cost: 450, description: 'Floating luminous solar ring', tier: 'Epic' },
  { id: 'kabuto', name: 'Samurai Kabuto', cost: 500, description: 'Iron horned warrior crest', tier: 'Legendary' },
  { id: 'spacehelm', name: 'Astro Dome', cost: 600, description: 'Pressurized orbital bubble', tier: 'Legendary' },
  { id: 'valkyrie', name: 'Valkyrie Crest', cost: 750, description: 'Winged mythical battle adornment', tier: 'Legendary' },
];

export const Avatar: React.FC<AvatarProps> = ({
  type,
  equippedItem = 'none',
  size = 56,
  className = '',
  showHalo = false,
  showAccountRing = false,
}) => {
  const renderGeometry = () => {
    switch (type) {
      case 'fox':
        return (
          <g>
            <polygon points="50,15 82,65 18,65" fill="#f59e0b" opacity="0.9" />
            <polygon points="50,42 74,78 26,78" fill="#d97706" />
            <polygon points="50,62 62,86 38,86" fill="#fef3c7" />
            <line x1="50" y1="15" x2="50" y2="86" stroke="#b45309" strokeWidth="2" />
          </g>
        );
      case 'owl':
        return (
          <g>
            <circle cx="50" cy="50" r="34" fill="#6366f1" opacity="0.2" />
            <circle cx="36" cy="46" r="14" fill="#4338ca" />
            <circle cx="64" cy="46" r="14" fill="#4338ca" />
            <circle cx="36" cy="46" r="6" fill="#e0e7ff" />
            <circle cx="64" cy="46" r="6" fill="#e0e7ff" />
            <polygon points="50,56 44,70 56,70" fill="#f59e0b" />
          </g>
        );
      case 'whale':
        return (
          <g>
            <path
              d="M18,55 C25,25 75,25 82,55 C70,72 30,72 18,55 Z"
              fill="#0284c7"
              opacity="0.85"
            />
            <path d="M78,50 Q88,38 88,30 Q74,42 72,50 Z" fill="#38bdf8" />
            <circle cx="32" cy="50" r="3.5" fill="#f0f9ff" />
            <path d="M22,60 Q50,70 76,60" stroke="#0369a1" strokeWidth="2.5" fill="none" />
          </g>
        );
      case 'cactus':
        return (
          <g>
            <rect x="42" y="20" width="16" height="60" rx="8" fill="#10b981" />
            <path d="M24,42 L24,52 C24,58 32,58 42,58" stroke="#059669" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M76,34 L76,46 C76,52 68,52 58,52" stroke="#059669" strokeWidth="6" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="30" r="2" fill="#d1fae5" />
          </g>
        );
      case 'comet':
        return (
          <g>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
            <line x1="32" y1="32" x2="80" y2="80" stroke="#c084fc" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
            <circle cx="76" cy="76" r="14" fill="#a855f7" />
            <circle cx="76" cy="76" r="7" fill="#faf5ff" />
          </g>
        );
      case 'lotus':
        return (
          <g>
            <ellipse cx="50" cy="50" rx="14" ry="32" fill="#ec4899" opacity="0.8" />
            <ellipse cx="50" cy="50" rx="14" ry="32" fill="#f472b6" opacity="0.8" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="14" ry="32" fill="#f472b6" opacity="0.8" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="8" fill="#fde047" />
          </g>
        );
      case 'geode':
        return (
          <g>
            <polygon points="50,18 78,34 82,68 50,86 18,68 22,34" fill="#312e81" stroke="#6366f1" strokeWidth="3" />
            <polygon points="50,28 70,40 72,62 50,74 28,62 30,40" fill="#4f46e5" />
            <polygon points="50,38 62,46 64,56 50,62 36,56 38,46" fill="#a5b4fc" />
          </g>
        );
      case 'ember':
        return (
          <g>
            <polygon points="50,15 72,50 50,85 28,50" fill="#ef4444" opacity="0.9" />
            <polygon points="50,25 66,50 50,75 34,50" fill="#f97316" />
            <circle cx="50" cy="50" r="7" fill="#fef08a" />
          </g>
        );
      case 'frost':
        return (
          <g>
            <line x1="50" y1="18" x2="50" y2="82" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <line x1="18" y1="50" x2="82" y2="50" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
            <line x1="28" y1="28" x2="72" y2="72" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="72" x2="72" y2="28" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="50" r="5" fill="#f0f9ff" />
          </g>
        );
      case 'moss':
      default:
        return (
          <g>
            <circle cx="44" cy="46" r="22" fill="#047857" opacity="0.8" />
            <circle cx="58" cy="56" r="18" fill="#10b981" opacity="0.85" />
            <circle cx="40" cy="62" r="14" fill="#059669" />
            <circle cx="56" cy="38" r="12" fill="#6ee7b7" />
          </g>
        );
    }
  };

  const renderEquipment = () => {
    switch (equippedItem) {
      case 'cap':
        return (
          <g id="eq-cap">
            <path d="M26,30 Q50,16 74,30 L86,34 Q70,30 50,30 L26,30 Z" fill="#64748b" />
            <ellipse cx="50" cy="28" rx="24" ry="10" fill="#334155" />
            <path d="M50,18 Q72,18 78,28 L86,33 Q68,28 50,28 Z" fill="#f8fafc" opacity="0.3" />
          </g>
        );
      case 'shades':
        return (
          <g id="eq-shades">
            <rect x="25" y="42" width="22" height="12" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="53" y="42" width="22" height="12" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="47" y1="46" x2="53" y2="46" stroke="#38bdf8" strokeWidth="2" />
            <line x1="28" y1="45" x2="42" y2="51" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
            <line x1="56" y1="45" x2="70" y2="51" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />
          </g>
        );
      case 'tophat':
        return (
          <g id="eq-tophat">
            <rect x="36" y="10" width="28" height="24" rx="2" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
            <line x1="36" y1="28" x2="64" y2="28" stroke="#8b5cf6" strokeWidth="3" />
            <ellipse cx="50" cy="34" rx="26" ry="6" fill="#0f172a" />
          </g>
        );
      case 'bandana':
        return (
          <g id="eq-bandana">
            <polygon points="26,38 74,38 50,62" fill="#ec4899" stroke="#db2777" strokeWidth="1.5" />
            <circle cx="50" cy="46" r="3" fill="#fdf2f8" />
            <circle cx="42" cy="42" r="2" fill="#fdf2f8" />
            <circle cx="58" cy="42" r="2" fill="#fdf2f8" />
          </g>
        );
      case 'beret':
        return (
          <g id="eq-beret">
            <ellipse cx="50" cy="24" rx="28" ry="10" fill="#be123c" transform="rotate(-8 50 24)" />
            <circle cx="48" cy="14" r="2.5" fill="#881337" />
          </g>
        );
      case 'headset':
        return (
          <g id="eq-headset">
            <path d="M22,50 C22,25 78,25 78,50" fill="none" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <rect x="18" y="44" width="8" height="18" rx="4" fill="#0284c7" />
            <rect x="74" y="44" width="8" height="18" rx="4" fill="#0284c7" />
            <path d="M24,58 Q34,70 44,66" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="45" cy="65" r="3" fill="#0284c7" />
          </g>
        );
      case 'fedora':
        return (
          <g id="eq-fedora">
            <ellipse cx="50" cy="32" rx="30" ry="8" fill="#78350f" />
            <path d="M34,30 Q50,14 66,30 L62,32 L38,32 Z" fill="#92400e" />
            <line x1="36" y1="28" x2="64" y2="28" stroke="#f59e0b" strokeWidth="2.5" />
          </g>
        );
      case 'helmet':
        return (
          <g id="eq-helmet">
            <path d="M22,46 C22,20 78,20 78,46 L78,54 C78,56 74,58 70,58 L30,58 C26,58 22,56 22,54 Z" fill="#475569" />
            <path d="M30,42 L70,42 L66,50 L34,50 Z" fill="#38bdf8" opacity="0.9" />
          </g>
        );
      case 'visor':
        return (
          <g id="eq-visor">
            <path d="M20,44 Q50,38 80,44 L78,52 Q50,46 22,52 Z" fill="#06b6d4" opacity="0.85" />
            <line x1="24" y1="48" x2="76" y2="48" stroke="#ecfeff" strokeWidth="1.5" />
          </g>
        );
      case 'crown':
        return (
          <g id="eq-crown">
            <polygon points="26,28 34,12 50,22 66,12 74,28" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="34" cy="12" r="2.5" fill="#fef08a" />
            <circle cx="50" cy="22" r="2.5" fill="#f43f5e" />
            <circle cx="66" cy="12" r="2.5" fill="#fef08a" />
            <line x1="26" y1="28" x2="74" y2="28" stroke="#d97706" strokeWidth="3" />
          </g>
        );
      case 'halo':
        return (
          <g id="eq-halo">
            <ellipse cx="50" cy="14" rx="26" ry="7" fill="none" stroke="#fde047" strokeWidth="3.5" />
            <ellipse cx="50" cy="14" rx="26" ry="7" fill="none" stroke="#fef08a" strokeWidth="1.5" opacity="0.8" />
          </g>
        );
      case 'kabuto':
        return (
          <g id="eq-kabuto">
            <path d="M26,38 C26,18 74,18 74,38 L80,44 L20,44 Z" fill="#1e293b" />
            <path d="M50,18 L38,4 L44,22 Z" fill="#f59e0b" />
            <path d="M50,18 L62,4 L56,22 Z" fill="#f59e0b" />
            <circle cx="50" cy="26" r="4" fill="#ef4444" />
          </g>
        );
      case 'spacehelm':
        return (
          <g id="eq-spacehelm">
            <ellipse cx="50" cy="46" rx="34" ry="34" fill="#0284c7" opacity="0.25" stroke="#38bdf8" strokeWidth="2.5" />
            <ellipse cx="50" cy="46" rx="28" ry="24" fill="#0f172a" opacity="0.6" />
            <path d="M30,34 Q40,28 60,30" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          </g>
        );
      case 'valkyrie':
        return (
          <g id="eq-valkyrie">
            <path d="M26,36 Q8,20 12,8 Q24,18 28,32" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M74,36 Q92,20 88,8 Q76,18 72,32" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="50,18 42,28 58,28" fill="#38bdf8" />
          </g>
        );
      case 'none':
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-card border border-theme ${
        showAccountRing ? 'ring-2 ring-[#84cc16] shadow-[0_0_15px_rgba(132,204,22,0.35)]' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {showHalo && (
        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-md -z-10 pointer-events-none" />
      )}
      <svg viewBox="0 0 100 100" className="w-full h-full p-1 overflow-visible">
        {renderGeometry()}
        {renderEquipment()}
      </svg>
    </div>
  );
};
