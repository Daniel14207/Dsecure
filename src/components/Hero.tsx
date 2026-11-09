import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveSection } from '../types/product';
import {
  ShieldCheck,
  Wrench,
  Headphones,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react';
import { OfficialContactStrip } from './OfficialSocialIcons';

interface HeroProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenQuote: () => void;
}

interface SlideData {
  id: number;
  tag: string;
  titleLight: string;
  titleBold: string;
  description: string;
  ctaText: string;
  ctaSection: ActiveSection;
  secondaryCtaText?: string;
  image: string;
  badges: { label: string; sub?: string }[];
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    tag: 'D SECURE · EXPERT VIDÉOSURVEILLANCE & ALARME',
    titleLight: 'VOTRE SÉCURITÉ,',
    titleBold: 'NOTRE PRIORITÉ.',
    description:
      'Vente, installation et maintenance certifiée de systèmes de vidéosurveillance Hikvision, alarme anti-intrusion et contrôle d’accès à Madagascar.',
    ctaText: 'DÉCOUVRIR NOS OFFRES',
    ctaSection: 'cameras',
    secondaryCtaText: 'Demander un devis',
    image: '/assets/aistudio/Image_ChatGPT_9_nov._2026__14_09_41_38cf813c.png',
    badges: [
      { label: 'Matériels Originaux' },
      { label: 'Installation Offerte*', sub: '(sur packs)' },
      { label: 'Support Rapide' },
      { label: 'Surveillance à Distance' },
    ],
  },
  {
    id: 2,
    tag: 'CAMÉRAS HIKVISION COLORVU & ACUSENSE',
    titleLight: 'VISION COULEUR 24/7,',
    titleBold: 'INTELLIGENCE ACUSENSE.',
    description:
      'Caméras Ultra HD 4K avec vision nocturne en couleur permanente et intelligence artificielle pour distinguer humains et véhicules sans fausse alerte.',
    ctaText: 'VOIR LES CAMÉRAS HIKVISION',
    ctaSection: 'cameras',
    secondaryCtaText: 'Tous les modèles IP',
    image: '/assets/aistudio/Image_ChatGPT_9_nov._2026__14_10_11_4747ef2d.png',
    badges: [
      { label: 'Vision Nocturne Couleur' },
      { label: 'Détection IA AcuSense' },
      { label: 'Résolution 4K Ultra HD' },
      { label: 'Garantie Constructeur' },
    ],
  },
  {
    id: 3,
    tag: 'SURVEILLANCE AUTONOME SANS FIL',
    titleLight: 'CAMÉRAS SOLAIRES 4G,',
    titleBold: 'ZÉRO CÂBLE, 100% AUTONOMIE.',
    description:
      'Idéales pour chantiers, exploitations agricoles, villas isolées et résidences secondaires. Panneau solaire intégré, batterie longue durée et connexion 4G.',
    ctaText: 'DÉCOUVRIR LES CAMÉRAS SOLAIRES',
    ctaSection: 'cameras',
    secondaryCtaText: 'Fiche technique 4G',
    image: '/assets/hero/hero_solar_camera_1794223397190.jpg',
    badges: [
      { label: '100% Autonome Solaire' },
      { label: 'Connexion 4G LTE' },
      { label: 'Sites Isolés & Chantiers' },
      { label: 'Batterie Haute Capacité' },
    ],
  },
  {
    id: 4,
    tag: 'CAMÉRAS PTZ MOTORISÉES',
    titleLight: 'ZOOM OPTIQUE 32X,',
    titleBold: 'SURVEILLANCE LONGUE DISTANCE.',
    description:
      'Contrôle panoramique 360° et inclinaison avec suivi automatique des cibles. Sécurisez les grands espaces, périmètres industriels et domaines privés.',
    ctaText: 'EXPLORER LA GAMME PTZ',
    ctaSection: 'cameras',
    secondaryCtaText: 'Spécifications optiques',
    image: '/assets/hero/hero_ptz_surveillance_1794223399799.jpg',
    badges: [
      { label: 'Zoom Optique 32x' },
      { label: 'Rotation 360° Rapide' },
      { label: 'Auto-Tracking Cibles' },
      { label: 'Vision Nocturne 150m+' },
    ],
  },
  {
    id: 5,
    tag: 'SYSTÈMES ANTI-INTRUSION HIKVISION',
    titleLight: 'ALARMES AX PRO,',
    titleBold: 'PROTECTION SANS FAILLE.',
    description:
      'Centrales d’alarme sans fil AX PRO avec détecteurs PIRCAM photo instantanée, claviers tactiles, sirènes puissantes 110dB et télécommandes sécurisées.',
    ctaText: 'DÉCOUVRIR LES SYSTÈMES D’ALARME',
    ctaSection: 'alarms',
    secondaryCtaText: 'Calcul des tarifs × 2',
    image: '/assets/hero/hero_alarm_axpro_1794223400199.jpg',
    badges: [
      { label: 'Technologie Sans Fil Tri-X' },
      { label: 'Levée de Doute Photo PIRCAM' },
      { label: 'Sirène Extérieure 110dB' },
      { label: 'Batterie de Secours' },
    ],
  },
  {
    id: 6,
    tag: 'KITS & PACKS TOUT COMPRIS',
    titleLight: 'PACKS CLÉ EN MAIN,',
    titleBold: 'INSTALLATION OFFERTE.',
    description:
      'Packs 4, 8, 16 et 32 caméras avec enregistreur NVR 4K, disque dur Seagate SkyHawk certifié 24/7, câbles réseau et pose professionnelle par nos équipes.',
    ctaText: 'CHOISIR VOTRE PACK',
    ctaSection: 'packs',
    secondaryCtaText: 'Devis personnalisé',
    image: '/assets/hero/hero_complete_packs_1794223458459.jpg',
    badges: [
      { label: 'Enregistreur NVR Inclus' },
      { label: 'Disque Dur Surveillance' },
      { label: 'Câblage Complet Cat6' },
      { label: 'Installation Antananarivo' },
    ],
  },
  {
    id: 7,
    tag: 'SÉCURITÉ COMMERCIALE & INDUSTRIELLE',
    titleLight: 'ENTREPRISES & DÉPÔTS,',
    titleBold: 'SURVEILLANCE GRAND COMPTE.',
    description:
      'Infrastructures robustes pour entrepôts, commerces et banques : switchs PoE industriels 300m, baies 19 pouces, stockage haute capacité et monitoring centralisé.',
    ctaText: 'SOLUTIONS ENTREPRISES',
    ctaSection: 'network',
    secondaryCtaText: 'Étude de site gratuite',
    image: '/assets/hero/hero_enterprise_cctv_1794223400955.jpg',
    badges: [
      { label: 'Switchs PoE Longue Portée' },
      { label: 'Baies & Coffrets Muraux' },
      { label: 'Stockage Multi-Téraoctets' },
      { label: 'Supervision Multi-Sites' },
    ],
  },
  {
    id: 8,
    tag: 'CONTRÔLE D’ACCÈS BIOMÉTRIQUE',
    titleLight: 'RECONNAISSANCE FACIALE,',
    titleBold: 'ET EMPREINTES MINMOE.',
    description:
      'Terminaux d’accès intelligents sans contact Hikvision MinMoe avec reconnaissance faciale en moins de 0.2 seconde, lecteurs d’empreintes et badges RFID.',
    ctaText: 'VOIR LE CONTRÔLE D’ACCÈS',
    ctaSection: 'accessories',
    secondaryCtaText: 'Demander une démonstration',
    image: '/assets/hero/hero_access_control_1794223456623.jpg',
    badges: [
      { label: 'Reconnaissance < 0.2s' },
      { label: 'Lecteur Empreinte & Badge' },
      { label: 'Gestion Présence & Horaires' },
      { label: 'Anti-Usurpation Photo' },
    ],
  },
  {
    id: 9,
    tag: 'SERVICE TECHNIQUE CERTIFIÉ',
    titleLight: 'INSTALLATION EXPERTE,',
    titleBold: 'MAINTENANCE & GARANTIE.',
    description:
      'Nos techniciens qualifiés assurent la pose minutieuse, le paramétrage sécurisé du réseau et la maintenance préventive de vos équipements à Madagascar.',
    ctaText: 'DÉCOUVRIR NOS SERVICES',
    ctaSection: 'services',
    secondaryCtaText: 'Prendre rendez-vous',
    image: '/assets/hero/hero_technician_install_1794223400609.jpg',
    badges: [
      { label: 'Techniciens Certifiés' },
      { label: 'Câblage Propre & Sécurisé' },
      { label: 'Contrat de Maintenance' },
      { label: 'Garantie Pièces & Main d’œuvre' },
    ],
  },
  {
    id: 10,
    tag: 'APPLICATION MOBILE & CLOUD',
    titleLight: 'SURVEILLANCE EN DIRECT,',
    titleBold: 'SUR SMARTPHONE & PC.',
    description:
      'Gardez un œil sur votre domicile ou votre entreprise depuis n’importe où dans le monde grâce à l’application Hik-Connect. Alertes instantanées et relecture facile.',
    ctaText: 'CONFIGURER VOTRE ACCÈS DISTANT',
    ctaSection: 'contact',
    secondaryCtaText: 'Support Hik-Connect',
    image: '/assets/hero/hero_mobile_monitoring_1794223401054.jpg',
    badges: [
      { label: 'Application Hik-Connect' },
      { label: 'iOS & Android' },
      { label: 'Notifications Push en Direct' },
      { label: 'Relecture & Enregistrements' },
    ],
  },
];

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenQuote }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay effect every 5 seconds (5000ms) with smooth pause on hover
  useEffect(() => {
    if (isPaused) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused, nextSlide]);

  const currentSlide = HERO_SLIDES[currentIndex];

  return (
    <div className="relative bg-[#080808] text-white overflow-hidden">
      {/* HERO SLIDER CONTAINER */}
      <section
        className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        aria-label="Carrousel de présentations D SECURE"
      >
        {/* Background Slide Images with smooth fade transition */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Background Image */}
              <img
                src={slide.image}
                alt={slide.titleBold}
                className="w-full h-full object-cover object-center scale-100 transform transition-transform duration-10000 ease-out"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Contrast scrim & cinematic gradient overlay ensuring 100% text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30" />

              {/* Decorative Red Security Angle Line matching reference */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Slide Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Tag / Category lead-in */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[#D71920] font-mono text-[11px] sm:text-xs font-black tracking-widest uppercase mb-4 sm:mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#D71920] animate-pulse" />
              <span className="text-white">{currentSlide.tag}</span>
            </div>

            {/* Dynamic Headlines with Brand Red Emphasis */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.08] text-white">
              <span className="block text-zinc-100">{currentSlide.titleLight}</span>
              <span className="block text-[#D71920] mt-1">{currentSlide.titleBold}</span>
            </h1>

            {/* Description */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-zinc-300 font-medium leading-relaxed max-w-xl">
              {currentSlide.description}
            </p>

            {/* Trust Badges Strip matching design-reference */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 py-3 border-y border-white/10">
              {currentSlide.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                  {idx === 0 && <ShieldCheck className="w-4 h-4 text-[#D71920] shrink-0" />}
                  {idx === 1 && <Wrench className="w-4 h-4 text-[#D71920] shrink-0" />}
                  {idx === 2 && <Headphones className="w-4 h-4 text-[#D71920] shrink-0" />}
                  {idx === 3 && <Smartphone className="w-4 h-4 text-[#D71920] shrink-0" />}
                  <div>
                    <span className="font-bold text-[11px] sm:text-xs block leading-tight">
                      {badge.label}
                    </span>
                    {badge.sub && (
                      <span className="text-[10px] text-zinc-400 block">{badge.sub}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(currentSlide.ctaSection)}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg shadow-lg shadow-red-700/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg border border-white/20 backdrop-blur-md transition-colors"
              >
                <span>{currentSlide.secondaryCtaText || 'Demander un devis'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#D71920] text-white border border-white/20 flex items-center justify-center transition-all backdrop-blur-md shadow-lg"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#D71920] text-white border border-white/20 flex items-center justify-center transition-all backdrop-blur-md shadow-lg"
          aria-label="Slide suivante"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Pagination & Slide Counter (10 slides) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
          {/* Pause / Play Indicator */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-zinc-400 hover:text-white transition-colors p-1"
            title={isPaused ? 'Reprendre le défilement automatique' : 'Mettre en pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <span className="text-[11px] font-mono text-zinc-400 font-bold px-1">
            {currentIndex + 1} / {HERO_SLIDES.length}
          </span>

          <div className="flex items-center gap-1.5 ml-1">
            {HERO_SLIDES.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    isActive ? 'w-6 bg-[#D71920]' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Aller à la slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* THREE OFFICIAL CONTACT CARDS STRIP MATCHING REFERENCE IMAGE */}
      <OfficialContactStrip />
    </div>
  );
};
