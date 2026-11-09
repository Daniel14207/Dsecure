import React, { useState } from 'react';
import { ActiveSection } from '../types/product';
import { ShoppingBag, Phone, Menu, X, Shield, Search, CheckCircle2 } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQA: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenQA,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleNavClick = (section: ActiveSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top micro bar for trust and direct contact */}
      <div className="bg-zinc-950 px-4 py-1.5 border-b border-zinc-900 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D71920]" />
              D SECURE Madagascar
            </span>
            <span className="hidden sm:inline text-zinc-500">·</span>
            <span className="hidden sm:inline text-zinc-400">Votre sécurité, notre priorité.</span>
            <span className="hidden md:inline text-zinc-500">·</span>
            <span className="hidden md:inline text-zinc-400">Matériel Hikvision Certifié Original</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button
              onClick={onOpenQA}
              className="text-zinc-500 hover:text-zinc-300 transition-colors text-[11px] flex items-center gap-1"
              title="Audit conformité Excel & Photos"
            >
              <CheckCircle2 className="w-3 h-3 text-[#D71920]" />
              <span className="hidden sm:inline">Contrôle Données Excel</span>
            </button>
            <a
              href="mailto:camhtech.mg@gmail.com"
              className="hidden lg:inline hover:text-white transition-colors"
            >
              camhtech.mg@gmail.com
            </a>
            <a
              href={getDirectWhatsAppUrl('Bonjour D SECURE, j\'aimerais me renseigner sur vos équipements.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#D71920] hover:text-red-400 font-semibold transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+261 33 75 565 84</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Following Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D71920] group-hover:border-[#D71920]/60 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-zinc-200 transition-colors font-mono">
              D SECURE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold">
              Madagascar
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'home'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handleNavClick('cameras')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'cameras'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Caméras de surveillance
          </button>
          <button
            onClick={() => handleNavClick('alarms')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'alarms'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Systèmes d'alarme
          </button>
          <button
            onClick={() => handleNavClick('packs')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'packs'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Packs vidéosurveillance
          </button>
          <button
            onClick={() => handleNavClick('accessories')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'accessories'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Accessoires
          </button>
          <button
            onClick={() => handleNavClick('network')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'network'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Réseau & Switch
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'services'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'about'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            À propos
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeSection === 'contact'
                ? 'text-[#D71920] font-bold border-b-2 border-[#D71920]'
                : 'hover:text-white'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Cart & WhatsApp CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick search input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Rechercher caméra, référence..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 lg:w-56 bg-zinc-900/90 text-sm text-white placeholder-zinc-500 rounded-lg pl-8 pr-3 py-1.5 border border-zinc-800 focus:outline-none focus:border-[#D71920] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-xs text-zinc-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D71920]"
            aria-label={`Panier d'achats avec ${cartCount} articles`}
          >
            <ShoppingBag className="w-5 h-5 text-zinc-200" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D71920] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <a
            href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite demander un devis / catalogue.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#D71920] hover:bg-[#b8141a] rounded-lg transition-colors shadow-md shadow-red-950/30 whitespace-nowrap"
          >
            <span>Commander WhatsApp</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-3 pb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une référence, produit..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg pl-9 pr-3 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2 rounded text-left ${activeSection === 'home' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavClick('cameras')}
              className={`p-2 rounded text-left ${activeSection === 'cameras' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Caméras
            </button>
            <button
              onClick={() => handleNavClick('alarms')}
              className={`p-2 rounded text-left ${activeSection === 'alarms' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Alarmes
            </button>
            <button
              onClick={() => handleNavClick('packs')}
              className={`p-2 rounded text-left ${activeSection === 'packs' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Packs Vidéo
            </button>
            <button
              onClick={() => handleNavClick('accessories')}
              className={`p-2 rounded text-left ${activeSection === 'accessories' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Accessoires
            </button>
            <button
              onClick={() => handleNavClick('network')}
              className={`p-2 rounded text-left ${activeSection === 'network' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Réseau / Switch
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`p-2 rounded text-left ${activeSection === 'services' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`p-2 rounded text-left ${activeSection === 'about' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              À propos
            </button>
            <button
              onClick={() => handleNavClick('testimonials')}
              className={`p-2 rounded text-left ${activeSection === 'testimonials' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Avis clients
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`p-2 rounded text-left ${activeSection === 'contact' ? 'text-[#D71920] font-bold bg-zinc-900' : 'text-zinc-300'}`}
            >
              Contact
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
            <a
              href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite passer commande.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#D71920] rounded-lg"
            >
              Contacter via WhatsApp (+261 33 75 565 84)
            </a>
            <button
              onClick={() => {
                onOpenQA();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-zinc-400 py-1 text-center"
            >
              Audit données Excel & Conformité
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
