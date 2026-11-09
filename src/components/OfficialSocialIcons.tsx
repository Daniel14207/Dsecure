import React from 'react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const OfficialWhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* WhatsApp Official Green Circle */}
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    {/* WhatsApp Official White Handset & Speech Bubble Tail */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 4.2C7.692 4.2 4.2 7.692 4.2 12c0 1.488.42 2.88 1.148 4.068L4.5 19.5l3.548-.828A7.747 7.747 0 0012 19.8c4.308 0 7.8-3.492 7.8-7.8s-3.492-7.8-7.8-7.8zm3.94 10.98c-.168.468-.84.864-1.356.972-.36.072-.816.132-2.4-.528-2.028-.84-3.324-2.892-3.42-3.024-.1-.132-.816-1.092-.816-2.076 0-.984.516-1.464.7-1.668.18-.204.396-.252.528-.252.132 0 .264.004.372.012.12.012.276-.048.432.324.168.396.564 1.38.612 1.488.048.108.084.228.012.372-.072.144-.108.228-.216.36-.108.132-.228.288-.324.396-.108.108-.228.228-.1.444.132.228.588.972 1.26 1.572.864.768 1.596 1.008 1.824 1.116.228.108.36.096.492-.06.132-.144.564-.66.72-.888.144-.228.3-.192.492-.12.204.072 1.284.612 1.5.72.228.108.372.168.432.264.06.096.06.564-.108 1.032z"
      fill="white"
    />
  </svg>
);

export const OfficialGmailIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Official Google Multi-Colored Envelope Logo */}
    <path
      d="M20.25 5.25H3.75C2.78 5.25 2 6.03 2 7v10c0 .97.78 1.75 1.75 1.75h16.5c.97 0 1.75-.78 1.75-1.75V7c0-.97-.78-1.75-1.75-1.75z"
      fill="#F2F2F2"
    />
    <path
      d="M2 7v3.5l10 6.25 10-6.25V7c0-.97-.78-1.75-1.75-1.75H3.75C2.78 5.25 2 6.03 2 7z"
      fill="#EA4335"
    />
    <path
      d="M2 17c0 .97.78 1.75 1.75 1.75h3.5v-7.5L2 7.75V17z"
      fill="#4285F4"
    />
    <path
      d="M22 17c0 .97-.78 1.75-1.75 1.75h-3.5v-7.5l5.25-3.5V17z"
      fill="#34A853"
    />
    <path
      d="M16.75 18.75H7.25v-7.5L12 14.25l4.75-3V18.75z"
      fill="#FBBC04"
    />
    <path
      d="M12 14.25L2 7.75 3.75 5.25 12 10.5l8.25-5.25L22 7.75l-10 6.5z"
      fill="#EA4335"
    />
  </svg>
);

export const OfficialFacebookIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size = 24,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={`shrink-0 ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Official Facebook Blue Circle with White f */}
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M15.4 12.35l.4-2.65h-2.54V8.02c0-.72.35-1.42 1.48-1.42h1.15V4.34s-1.04-.18-2.04-.18c-2.08 0-3.44 1.26-3.44 3.54V9.7H8.1v2.65h2.25v6.41c.45.07.92.11 1.39.11.47 0 .94-.04 1.39-.11v-6.41h2.27z"
      fill="white"
    />
  </svg>
);

export const OfficialContactStrip: React.FC = () => {
  return (
    <div className="bg-[#080808] text-white border-t border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {/* Card 1: Official WhatsApp */}
          <a
            href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite me renseigner sur vos caméras et alarmes.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-emerald-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <OfficialWhatsAppIcon size={30} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                WhatsApp Direct
              </span>
              <span className="text-sm sm:text-base font-black text-white group-hover:text-emerald-400 transition-colors block truncate">
                +261 33 75 565 84
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Réponse rapide 7j/7
              </span>
            </div>
          </a>

          {/* Card 2: Official Gmail */}
          <a
            href="mailto:dsecure.mg@gmail.com"
            className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <OfficialGmailIcon size={30} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Email Officiel
              </span>
              <span className="text-sm sm:text-base font-black text-white group-hover:text-red-400 transition-colors block truncate">
                dsecure.mg@gmail.com
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">
                Réponse et devis sous 24h
              </span>
            </div>
          </a>

          {/* Card 3: Official Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-3 sm:p-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-blue-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <OfficialFacebookIcon size={30} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Facebook Page
              </span>
              <span className="text-sm sm:text-base font-black text-white group-hover:text-blue-400 transition-colors block truncate">
                D SECURE
              </span>
              <span className="text-[11px] text-blue-400 font-medium">
                Suivez-nous & actualités
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
