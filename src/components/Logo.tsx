import React, { useState, useEffect } from 'react';
import { ASSETS } from '../assets/images';
import { safeGetLocalStorage } from '../utils/storage';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'invoice' | 'icon' | 'symbol';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtext?: boolean;
  customLogoUrl?: string;
  titleAr?: string;
  withGlow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  customLogoUrl,
  titleAr = 'الذهب الأسود',
  withGlow = true
}) => {
  const [activeLogoSrc, setActiveLogoSrc] = useState<string>(() => {
    if (customLogoUrl) return customLogoUrl;
    const stored = safeGetLocalStorage('bg_custom_logo', '');
    return stored || ASSETS.logo;
  });

  useEffect(() => {
    if (customLogoUrl) {
      setActiveLogoSrc(customLogoUrl);
    } else {
      const stored = safeGetLocalStorage('bg_custom_logo', '');
      setActiveLogoSrc(stored || ASSETS.logo);
    }
  }, [customLogoUrl]);

  // Listen to custom logo storage events for immediate sync across tabs/modals
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = safeGetLocalStorage('bg_custom_logo', '');
      if (stored) {
        setActiveLogoSrc(stored);
      } else if (!customLogoUrl) {
        setActiveLogoSrc(ASSETS.logo);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bg_logo_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bg_logo_updated', handleStorageChange);
    };
  }, [customLogoUrl]);

  // Height mappings for transparent responsive branding
  const heightClasses = {
    sm: 'h-8 sm:h-9 max-w-[170px]',
    md: 'h-11 sm:h-13 max-w-[230px] sm:max-w-[270px]',
    lg: 'h-16 sm:h-20 max-w-[320px]',
    xl: 'h-24 sm:h-28 max-w-[400px]'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Luxury Royal Gold Glow styling - strictly respects transparency while highlighting the silhouette
  const glowBackdrop = withGlow ? (
    <div 
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-visible"
      aria-hidden="true"
    >
      {/* Soft warm gold aura */}
      <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-600/15 dark:from-amber-400/25 dark:via-yellow-400/30 dark:to-amber-500/25 blur-xl opacity-80 group-hover:opacity-100 transition-all duration-500 transform scale-110" />
      {/* Subtle core shimmer */}
      <div className="w-1/2 h-1/2 rounded-full bg-yellow-300/15 dark:bg-yellow-200/20 blur-md opacity-60" />
    </div>
  ) : null;

  // Combined drop-shadow filter class for tight contour gold radiance
  const imageGlowFilter = withGlow 
    ? 'filter drop-shadow-[0_2px_10px_rgba(217,119,6,0.30)] dark:drop-shadow-[0_2px_12px_rgba(245,158,11,0.40)] drop-shadow-[0_0_24px_rgba(234,179,8,0.18)]' 
    : 'filter drop-shadow-md';

  // Compact symbol/icon mode
  if (variant === 'icon' || variant === 'symbol') {
    return (
      <div className={`relative group flex items-center justify-center shrink-0 ${iconSizes[size]} ${className}`}>
        {glowBackdrop}
        <img 
          src={activeLogoSrc} 
          alt={titleAr || "الذهب الأسود"} 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = ASSETS.logo;
          }}
          className={`w-full h-full object-contain relative z-10 select-none ${imageGlowFilter} transition-transform duration-300 hover:scale-105`}
        />
      </div>
    );
  }

  // Full / Invoice mode
  if (variant === 'full' || variant === 'invoice') {
    return (
      <div className={`relative group flex flex-col items-center justify-center text-center ${className}`}>
        {glowBackdrop}
        <img 
          src={activeLogoSrc} 
          alt={titleAr || "الذهب الأسود"} 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = ASSETS.logo;
          }}
          className={`${heightClasses[size]} w-auto object-contain relative z-10 select-none ${imageGlowFilter} transition-transform duration-300 hover:scale-105`}
        />
      </div>
    );
  }

  // Default: Horizontal Navbar Logo
  return (
    <div className={`relative group flex items-center gap-2 ${className}`}>
      {glowBackdrop}
      <img 
        src={activeLogoSrc} 
        alt={titleAr || "الذهب الأسود - Black Gold"} 
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = ASSETS.logo;
        }}
        className={`${heightClasses[size]} w-auto object-contain relative z-10 select-none ${imageGlowFilter} transition-transform duration-300 group-hover:scale-[1.03]`}
      />
    </div>
  );
};
