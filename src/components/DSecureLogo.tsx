import React from 'react';

interface DSecureLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  withTagline?: boolean;
}

export const DSecureLogo: React.FC<DSecureLogoProps> = ({
  variant = 'light',
  size = 'md',
  className = '',
  withTagline = true,
}) => {
  const isDark = variant === 'dark';

  // Proportional heights for the official 913x248 horizontal logo
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    hero: 'h-16 sm:h-20',
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {isDark ? (
        // Footer / dark background: crisp white pill/card backing to preserve original black & red branding
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center">
          <img
            src="/assets/d-secure-logo.png"
            alt="D SECURE - Matériel de sécurité Madagascar"
            className={`${heightClasses[size]} w-auto object-contain`}
            loading="eager"
          />
        </div>
      ) : (
        // Header / light background: transparent direct rendering of the official logo
        <div className="flex flex-col">
          <img
            src="/assets/d-secure-logo.png"
            alt="D SECURE - Caméras de surveillance et sécurité"
            className={`${heightClasses[size]} w-auto object-contain max-w-[220px] sm:max-w-[280px]`}
            loading="eager"
          />
        </div>
      )}
    </div>
  );
};
