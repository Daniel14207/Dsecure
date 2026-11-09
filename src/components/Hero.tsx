import React from 'react';
import { Shield, Eye, Bell, Wrench, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { ActiveSection } from '../types/product';

interface HeroProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenQuote }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-[#080808] to-zinc-950 border-b border-zinc-800/80">
      {/* Subtle background security grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b15_1px,transparent_1px),linear-gradient(to_bottom,#18181b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#D71920]" />
              <span>Distributeur Spécialiste Hikvision · Madagascar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Votre sécurité, <br />
              <span className="text-[#D71920]">notre priorité.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              D SECURE équipe résidences, commerces et sites industriels à Madagascar avec les dernières technologies de vidéosurveillance Hikvision, systèmes d'alarme sans fil AX PRO et contrôle d'accès.
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                <span>Matériel 100% Original & Certifié Hikvision</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                <span>Prix clairs en Ariary (Ar) avec facture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                <span>Prise de commande instantanée via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D71920] shrink-0" />
                <span>Installation et support technique sur site</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('cameras')}
                className="py-3 px-6 bg-[#D71920] hover:bg-[#b8141a] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-950/40"
              >
                <span>Découvrir les caméras</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('alarms')}
                className="py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-lg border border-zinc-800 transition-colors flex items-center gap-2"
              >
                <Bell className="w-4 h-4 text-[#D71920]" />
                <span>Systèmes d'alarme</span>
              </button>

              <button
                onClick={onOpenQuote}
                className="py-3 px-5 text-zinc-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-[#D71920]" />
                <span>Demander une étude gratuite</span>
              </button>
            </div>
          </div>

          {/* Visual Showcase Right Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-zinc-950/90 rounded-2xl border border-zinc-800/80 p-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900 text-xs">
                <span className="font-mono text-[#D71920] font-bold">HIKVISION SMART HYBRID</span>
                <span className="text-emerald-400 font-medium">Pack Prêt à l'emploi</span>
              </div>

              {/* Showcase Featured Image */}
              <div className="aspect-4/3 my-4 flex items-center justify-center bg-zinc-900/50 rounded-xl p-3 border border-zinc-900">
                <img
                  src="/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg"
                  alt="Pack Vidéosurveillance D SECURE Hikvision"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Kit Vidéosurveillance Hybride 4 Caméras</h3>
                  <span className="text-sm font-mono font-bold text-[#D71920] tabular-nums">
                    1 400 000 Ar
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Comprend 1 DVR AcuSense 1080p + 4 Caméras Dual-Light IR 30m + Câbles 18m + Alimentation dédiée.
                </p>
                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Réf: DS-J142I/7204HGHI</span>
                  <button
                    onClick={() => onNavigate('packs')}
                    className="text-[#D71920] hover:text-red-400 font-bold flex items-center gap-1"
                  >
                    <span>Voir les packs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Category / Capability Quick Row */}
        <div className="mt-14 pt-8 border-t border-zinc-900 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('cameras')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#D71920] mb-3 group-hover:border-[#D71920]/40">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Caméras & Dômes</h4>
            <p className="text-xs text-zinc-400">IP 4K, ColorVu 24/7, PTZ 32× et caméras solaires 4G.</p>
          </button>

          <button
            onClick={() => onNavigate('alarms')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#D71920] mb-3 group-hover:border-[#D71920]/40">
              <Bell className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Alarmes AX PRO</h4>
            <p className="text-xs text-zinc-400">Kits sans fil 64 zones, PIRCAM avec photos, sirènes 110dB.</p>
          </button>

          <button
            onClick={() => onNavigate('network')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#D71920] mb-3 group-hover:border-[#D71920]/40">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Switch PoE & Réseau</h4>
            <p className="text-xs text-zinc-400">Switchs PoE 300m, routeurs Wi-Fi 6, ponts sans fil longue portée.</p>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 hover:border-zinc-700 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#D71920] mb-3 group-hover:border-[#D71920]/40">
              <Wrench className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Services & Pose</h4>
            <p className="text-xs text-zinc-400">Installation certifiée, maintenance et audit de sécurité gratuit.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
