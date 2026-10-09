import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

const baseProps = (size: number | string = 20, className = '') => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
});

export const CameraIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export const CameraSwitchIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M19 12a7 7 0 0 1-13.8 1.7M5 12a7 7 0 0 1 13.8-1.7" />
    <polyline points="20 8 20 12 16 12" />
    <polyline points="4 16 4 12 8 12" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.63-1.5-2.8-2.5-4.5-1 1.7-2.5 2.87-2.5 4.5z" />
    <path d="M12 2c1 3 4 5.5 6 9.5a7 7 0 1 1-12 0c2-4 5-6.5 6-9.5z" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
    <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
  </svg>
);

export const CrownIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

export const CoinIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9.5 9.5h5a1.5 1.5 0 0 1 0 3h-5a1.5 1.5 0 0 0 0 3h5" />
  </svg>
);

export const GemIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M6 3h12l4 6-10 12L2 9z" />
    <path d="M11 3 8 9l4 12 4-12-3-6" />
    <path d="M2 9h20" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const ZapIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M9 21v-2a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const UnlockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

export const ScanFrameIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 8 14" />
  </svg>
);

export const LayersIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const Volume2Icon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeXIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

export const VibrateIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <line x1="2" y1="8" x2="2" y2="16" />
    <line x1="22" y1="8" x2="22" y2="16" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const SwordsIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" y1="19" x2="19" y2="13" />
    <line x1="16" y1="16" x2="20" y2="20" />
    <line x1="19" y1="21" x2="21" y2="19" />
    <polyline points="9.5 17.5 21 6 21 3 18 3 6.5 14.5" />
    <line x1="11" y1="19" x2="5" y2="13" />
    <line x1="8" y1="16" x2="4" y2="20" />
    <line x1="5" y1="21" x2="3" y2="19" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
  </svg>
);

export const PackageIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <line x1="16.5" y1="9.4" x2="7.55" y2="4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12.01 20.71 7" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export const ListChecksIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </svg>
);

export const RefreshCwIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const SlidersIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

export const LogInIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export const LogOutIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg {...baseProps(size, className)} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
