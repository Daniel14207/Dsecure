import React from 'react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

/**
 * Real Official WhatsApp Icon
 * Canonical #25D366 green circle with authentic speech bubble & handset mark
 */
export const OfficialWhatsAppIcon: React.FC<{
  className?: string;
  size?: number;
  variant?: 'color' | 'white';
}> = ({ className = 'w-6 h-6', size = 24, variant = 'color' }) => {
  if (variant === 'white') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={`shrink-0 ${className}`}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.73 1.5 5.25L2 22l4.9-1.42A9.95 9.95 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.06 14.15c-.21.6-.96 1.11-1.63 1.25-.46.1-1.05.17-3.08-.68-2.6-1.07-4.26-3.7-4.39-3.87-.13-.17-1.05-1.4-1.05-2.66 0-1.26.66-1.88.9-2.14.23-.26.51-.32.68-.32.17 0 .33.01.48.01.15.01.35-.06.55.42.21.51.73 1.77.79 1.9.06.13.1.29.01.47-.09.19-.14.3-.28.46-.14.17-.3.37-.41.51-.13.14-.3.29-.13.57.17.29.75 1.25 1.62 2.02 1.11.98 2.05 1.29 2.34 1.43.29.14.46.12.63-.08.17-.19.6-.7.76-.94.16-.24.33-.2.55-.12.23.08 1.47.69 1.72.82.25.13.42.19.48.3.06.11.06.63-.15 1.23z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* WhatsApp Official Green Background Circle */}
      <circle cx="24" cy="24" r="24" fill="#25D366" />
      {/* WhatsApp Official White Speech Bubble and Handset */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 8.5C15.44 8.5 8.5 15.44 8.5 24c0 3.02.86 5.85 2.36 8.24L9 39l7.03-1.83A15.4 15.4 0 0024 39.5c8.56 0 15.5-6.94 15.5-15.5S32.56 8.5 24 8.5zm7.84 21.84c-.33.93-1.67 1.72-2.7 1.93-.72.15-1.63.26-4.79-1.05-4.04-1.67-6.62-5.76-6.82-6.02-.2-.26-1.63-2.17-1.63-4.14 0-1.96 1.03-2.92 1.4-3.32.36-.41.79-.5 1.05-.5.26 0 .52.01.74.02.24.02.55-.09.86.65.33.79 1.13 2.75 1.22 2.96.1.21.16.46.02.74-.15.29-.21.46-.43.72-.21.26-.46.57-.64.79-.21.21-.46.46-.2.88.26.46 1.17 1.94 2.51 3.14 1.72 1.53 3.18 2.01 3.63 2.22.46.21.72.19.98-.12.26-.29.93-1.09 1.18-1.47.25-.38.51-.32.86-.19.36.15 2.28 1.08 2.67 1.27.39.2.65.29.75.46.1.17.1.98-.23 1.91z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

/**
 * Real Official Google Gmail Icon
 * Canonical white circle container hosting the Google Workspace 4-color M logo
 */
export const OfficialGmailIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* White circular backing for visual harmony and contrast */}
    <circle cx="24" cy="24" r="24" fill="#FFFFFF" />
    <circle cx="24" cy="24" r="23.25" stroke="#E5E7EB" strokeWidth="0.75" />
    {/* Official Google Workspace 4-color Gmail M */}
    <g transform="translate(6, 7.5) scale(0.75)">
      {/* Left blue leg */}
      <path
        d="M6 38V17.5L14 23.5V38C14 39.1 13.1 40 12 40H8C6.9 40 6 39.1 6 38Z"
        fill="#4285F4"
      />
      {/* Right green leg */}
      <path
        d="M42 38V17.5L34 23.5V38C34 39.1 34.9 40 36 40H40C41.1 40 42 39.1 42 38Z"
        fill="#34A853"
      />
      {/* Top red V fold and chevron */}
      <path
        d="M34 13.5V23.5L24 16L14 23.5V13.5L24 6L34 13.5Z"
        fill="#EA4335"
      />
      {/* Top right yellow corner transition */}
      <path
        d="M42 11.5V17.5L34 23.5V13.5L37.5 10.9C39.2 9.6 42 10.8 42 11.5Z"
        fill="#FBBC04"
      />
      {/* Top left dark red corner transition */}
      <path
        d="M6 11.5V17.5L14 23.5V13.5L10.5 10.9C8.8 9.6 6 10.8 6 11.5Z"
        fill="#C5221F"
      />
    </g>
  </svg>
);

/**
 * Real Official Facebook Icon
 * Canonical #1877F2 blue circle with white Meta Facebook 'f'
 */
export const OfficialFacebookIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Official Facebook Blue Background Circle */}
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    {/* Official Facebook White 'f' with exact brand geometry */}
    <path
      d="M30.5 24.8l.85-5.5h-5.28v-3.57c0-1.51.74-2.98 3.1-2.98h2.4V8.04s-2.18-.37-4.26-.37c-4.35 0-7.2 2.64-7.2 7.42v4.21H15.2v5.5h4.91v13.3c1 .16 2.02.24 3.06.24 1.04 0 2.06-.08 3.06-.24V24.8h4.27z"
      fill="#FFFFFF"
    />
  </svg>
);

/**
 * Sleek 3-Contact Strip directly matching the user's reference image
 * (Image ChatGPT 9 nov. 2026, 14_10_11.png)
 *
 * WhatsApp (+261 33 75 565 84) | Gmail (dsecure.mg@gmail.com) | Facebook (D SECURE)
 */
export const OfficialContactStrip: React.FC = () => {
  return (
    <div className="bg-[#080808] text-white border-t border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/90">
          {/* Card 1: Official WhatsApp */}
          <a
            href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite me renseigner sur vos équipements de surveillance et alarmes.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-start sm:justify-center gap-4 py-4 sm:py-5 px-4 sm:px-6 hover:bg-zinc-900/70 transition-colors group"
            aria-label="Contacter D SECURE sur WhatsApp"
          >
            <div className="group-hover:scale-105 transition-transform shrink-0">
              <OfficialWhatsAppIcon size={46} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block leading-tight">
                WHATSAPP
              </span>
              <span className="text-base sm:text-lg font-black text-white group-hover:text-emerald-400 transition-colors block truncate tracking-tight">
                +261 33 75 565 84
              </span>
              <span className="text-xs text-zinc-400 font-normal block leading-tight">
                Réponse rapide
              </span>
            </div>
          </a>

          {/* Card 2: Official Gmail */}
          <a
            href="mailto:dsecure.mg@gmail.com"
            className="flex items-center justify-start sm:justify-center gap-4 py-4 sm:py-5 px-4 sm:px-6 hover:bg-zinc-900/70 transition-colors group"
            aria-label="Envoyer un email à dsecure.mg@gmail.com"
          >
            <div className="group-hover:scale-105 transition-transform shrink-0">
              <OfficialGmailIcon size={46} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block leading-tight">
                GMAIL
              </span>
              <span className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors block truncate tracking-tight">
                dsecure.mg@gmail.com
              </span>
              <span className="text-xs text-zinc-400 font-normal block leading-tight">
                Réponse sous 24h
              </span>
            </div>
          </a>

          {/* Card 3: Official Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-start sm:justify-center gap-4 py-4 sm:py-5 px-4 sm:px-6 hover:bg-zinc-900/70 transition-colors group"
            aria-label="Suivre la page Facebook D SECURE"
          >
            <div className="group-hover:scale-105 transition-transform shrink-0">
              <OfficialFacebookIcon size={46} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block leading-tight">
                FACEBOOK
              </span>
              <span className="text-base sm:text-lg font-black text-white group-hover:text-blue-400 transition-colors block truncate tracking-tight">
                D SECURE
              </span>
              <span className="text-xs text-zinc-400 font-normal block leading-tight">
                Suivez-nous
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

