import React from 'react';
import { Shield, ArrowRight, CheckCircle2, ShieldCheck, Wrench, Headphones, Smartphone } from 'lucide-react';
import { ActiveSection } from '../types/product';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface HeroProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenQuote }) => {
  return (
    <div>
      {/* High-Impact Hero Banner matching design reference */}
      <section className="relative overflow-hidden bg-[#080808] text-white border-b border-zinc-900">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D71920]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-balance">
                VOTRE SÉCURITÉ,<br />
                <span className="text-[#D71920]">NOTRE PRIORITÉ.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
                Vente, installation et maintenance de systèmes de vidéosurveillance, alarme et contrôle d'accès à Madagascar.
              </p>

              {/* 4 Feature Badges matching design-reference.png */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex flex-col items-center sm:items-start gap-1 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center sm:text-left">
                  <ShieldCheck className="w-5 h-5 text-white shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-zinc-200">
                    Matériels Originaux
                  </span>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center sm:text-left">
                  <Wrench className="w-5 h-5 text-white shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-zinc-200">
                    Installation Offerte (Packs)
                  </span>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center sm:text-left">
                  <Headphones className="w-5 h-5 text-white shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-zinc-200">
                    Support Rapide
                  </span>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center sm:text-left">
                  <Smartphone className="w-5 h-5 text-white shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-zinc-200">
                    Surveillance à distance
                  </span>
                </div>
              </div>

              {/* Red CTA Button with Arrow */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('packs')}
                  className="inline-flex items-center gap-3 px-8 py-3.5 text-sm font-extrabold tracking-wider uppercase text-white bg-[#D71920] hover:bg-[#b8141a] rounded-md shadow-lg shadow-red-900/40 transition-all hover:translate-x-1"
                >
                  <span>DÉCOUVRIR NOS OFFRES</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Montage (5 cols) - Hikvision cameras & NVR showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-4/3 rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-950 p-6 border border-zinc-800/80 shadow-2xl flex flex-col justify-between overflow-hidden group">
                {/* Glowing subtle ring */}
                <div className="absolute inset-0 bg-radial from-red-600/10 via-transparent to-transparent opacity-50" />

                <div className="flex items-center justify-between relative z-10 text-xs">
                  <span className="font-black text-red-500 tracking-wider font-mono">HIKVISION CERTIFIED</span>
                  <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold text-[10px]">
                    GARANTIE OFFICIELLE
                  </span>
                </div>

                {/* Collage of real Hikvision hardware */}
                <div className="relative my-4 flex items-center justify-center h-48 z-10">
                  <div className="absolute -left-2 bottom-4 w-28 h-28 bg-white/5 rounded-xl p-2 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg transform -rotate-6 transition-transform group-hover:rotate-0">
                    <img
                      src="/assets/aistudio/ip-1-0_r46_c1_18_9897ae6b.jpg"
                      alt="Caméra IP Hikvision ColorVu"
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                    />
                  </div>

                  <div className="w-44 h-36 bg-zinc-900/90 rounded-2xl p-2 border border-zinc-700/80 flex items-center justify-center shadow-2xl z-20">
                    <img
                      src="/assets/aistudio/nvr_r6_c1_8_d5977e04.jpg"
                      alt="Enregistreur NVR Hikvision 4K"
                      className="max-h-full max-w-full object-contain drop-shadow-lg"
                    />
                  </div>

                  <div className="absolute -right-2 top-2 w-28 h-28 bg-white/5 rounded-xl p-2 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg transform rotate-6 transition-transform group-hover:rotate-0">
                    <img
                      src="/assets/aistudio/analog_r23_c1_17_2896f0f9.jpg"
                      alt="Caméra Turret Hikvision Smart Light"
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Equipment Brand Label */}
                <div className="relative z-10 pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-widest text-white text-sm">HIKVISION</span>
                    <span className="text-[10px] text-zinc-400">· NVR & Caméras IA</span>
                  </div>
                  <span className="text-xs font-bold text-[#D71920]">Vision Nocturne Colorée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Bar - matching design-reference.png */}
      <section className="bg-white border-b border-zinc-200 py-3.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* WhatsApp column */}
          <a
            href={getDirectWhatsAppUrl('Bonjour D SECURE, j\'aimerais me renseigner sur vos équipements de sécurité.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.188 8.188 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.17 8.17 0 012.41 5.82c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/>
              </svg>
            </div>
            <div>
              <div className="font-extrabold uppercase tracking-wider text-zinc-900 text-[11px]">
                WHATSAPP
              </div>
              <div className="font-bold text-sm text-zinc-900 group-hover:text-[#25D366] transition-colors">
                +261 33 75 565 84
              </div>
              <div className="text-[10px] text-zinc-600 font-medium">Réponse rapide garantie</div>
            </div>
          </a>

          {/* Gmail column */}
          <a
            href="mailto:dscure.mg@gmail.com"
            className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#EA4335] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-black text-lg">M</span>
            </div>
            <div>
              <div className="font-extrabold uppercase tracking-wider text-zinc-900 text-[11px]">
                GMAIL
              </div>
              <div className="font-bold text-sm text-zinc-900 group-hover:text-[#EA4335] transition-colors">
                dscure.mg@gmail.com
              </div>
              <div className="text-[10px] text-zinc-600 font-medium">Réponse sous 24h</div>
            </div>
          </a>

          {/* Facebook column */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-black text-lg">f</span>
            </div>
            <div>
              <div className="font-extrabold uppercase tracking-wider text-zinc-900 text-[11px]">
                FACEBOOK
              </div>
              <div className="font-bold text-sm text-zinc-900 group-hover:text-[#1877F2] transition-colors">
                D SECURE
              </div>
              <div className="text-[10px] text-zinc-600 font-medium">Suivez nos actualités</div>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
};
