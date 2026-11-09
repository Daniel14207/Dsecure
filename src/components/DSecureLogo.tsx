import React from 'react';

interface DSecureLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
  className?: string;
}

export const DSecureLogo: React.FC<DSecureLogoProps> = ({
  variant = 'light',
  size = 'md',
  withTagline = true,
  className = '',
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official D SECURE Shield / Camera Eye Emblem */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-[#D71920] to-[#b31419] flex items-center justify-center shadow-md shadow-red-600/20`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Stylized camera aperture / shield eye */}
          <path
            d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5Z"
            fill="white"
            fillOpacity="0.15"
          />
          {/* Shield outline */}
          <path
            d="M20 7L31 12V21C31 27.5 26.2 32.8 20 34C13.8 32.8 9 27.5 9 21V12L20 7Z"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Center surveillance camera lens aperture */}
          <circle cx="20" cy="20" r="5.5" fill="white" />
          <circle cx="20" cy="20" r="2.8" fill="#D71920" />
          <circle cx="18.8" cy="18.8" r="1.1" fill="white" />
          {/* IR beam / wave accent */}
          <path
            d="M15 15C16.4 13.6 18.2 12.8 20 12.8C21.8 12.8 23.6 13.6 25 15"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center tracking-tight">
          <span className="text-[#D71920] font-black font-sans tracking-tight mr-1 text-2xl sm:text-3xl">
            D
          </span>
          <span
            className={`font-black font-sans tracking-wider ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-[#080808]'
            }`}
          >
            SECURE
          </span>
        </div>

        {withTagline && (
          <span
            className={`font-bold tracking-[0.16em] uppercase mt-1 ${taglineSizes[size]} ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            VOTRE SÉCURITÉ, NOTRE PRIORITÉ.
          </span>
        )}
      </div>
    </div>
  );
};
