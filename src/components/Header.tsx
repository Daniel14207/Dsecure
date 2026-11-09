import React, { useState } from 'react';
import { ActiveSection } from '../types/product';
import { ShoppingBag, Phone, Menu, X, Search, CheckCircle2, MessageCircle } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { DSecureLogo } from './DSecureLogo';

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenQA: () => void;
  onOpenLiveChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenQA,
  onOpenLiveChat,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  const handleNavClick = (section: ActiveSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
    setShowCatalogDropdown(false);
  };

  const navItems: { label: string; section: ActiveSection }[] = [
    { label: 'ACCUEIL', section: 'home' },
    { label: 'SERVICES', section: 'services' },
    { label: 'CAMÉRAS', section: 'cameras' },
    { label: 'PACKS', section: 'packs' },
    { label: 'ALARMES', section: 'alarms' },
    { label: 'DVR & NVR', section: 'dvr_nvr' },
    { label: 'ACCESSOIRES', section: 'accessories' },
    { label: 'CONTACT', section: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-xs">
      {/* Top micro bar for fast trust and customer service */}
      <div className="bg-[#080808] px-4 py-1.5 text-xs text-zinc-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D71920] animate-pulse" />
              D SECURE Madagascar
            </span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-zinc-300">Votre sécurité, notre priorité.</span>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="hidden md:inline text-zinc-400">Équipements Hikvision Certifiés 100% Originaux</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenQA}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              title="Audit conformité Excel & Catalogue officiel"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D71920]" />
              <span className="hidden sm:inline">Audit Données Excel</span>
            </button>
            <span className="text-zinc-600 hidden lg:inline">|</span>
            <a
              href="mailto:camhtech.mg@gmail.com"
              className="hidden lg:inline text-zinc-300 hover:text-white transition-colors"
            >
              camhtech.mg@gmail.com
            </a>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <a
              href={getDirectWhatsAppUrl('Bonjour D SECURE, j\'aimerais me renseigner sur vos équipements.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white hover:text-red-400 font-bold transition-colors"
            >
              <Phone className="w-3 h-3 text-[#D71920]" />
              <span>+261 33 75 565 84</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Wordmark & True Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="focus:outline-none transition-transform hover:scale-[1.01] active:scale-[0.99] text-left"
          aria-label="Accueil D SECURE"
        >
          <DSecureLogo variant="light" size="md" />
        </button>

        {/* Center Navigation Links (Upper-case matching design reference) */}
        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-bold tracking-wider text-zinc-800">
          {navItems.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className={`relative py-2 transition-colors hover:text-[#D71920] ${
                  isActive ? 'text-[#D71920]' : 'text-zinc-700'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D71920] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search, Cart, WhatsApp Button */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Rechercher caméra, référence..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-44 lg:w-52 bg-zinc-100 hover:bg-zinc-50 text-xs text-zinc-900 placeholder-zinc-500 rounded-full pl-8 pr-7 py-2 border border-zinc-200 focus:outline-none focus:border-[#D71920] focus:ring-1 focus:ring-[#D71920] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-xs font-bold text-zinc-400 hover:text-zinc-700"
              >
                ×
              </button>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D71920]"
            aria-label={`Panier d'achats (${cartCount} articles)`}
          >
            <ShoppingBag className="w-5 h-5 text-zinc-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D71920] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* Red WhatsApp Button - matching design-reference.png */}
          <a
            href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite passer commande / demander un devis.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-wider uppercase text-white bg-[#D71920] hover:bg-[#b8141a] rounded-md shadow-md shadow-red-700/20 transition-all hover:shadow-lg hover:shadow-red-700/30"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WHATSAPP</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 xl:hidden text-zinc-800 hover:text-black focus:outline-none"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un équipement, modèle..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-100 text-sm text-zinc-900 placeholder-zinc-500 rounded-lg pl-9 pr-3 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  activeSection === item.section
                    ? 'text-white bg-[#D71920]'
                    : 'text-zinc-800 bg-zinc-50 hover:bg-zinc-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('hdd')}
              className={`p-3 rounded-lg text-left transition-colors ${
                activeSection === 'hdd'
                  ? 'text-white bg-[#D71920]'
                  : 'text-zinc-800 bg-zinc-50 hover:bg-zinc-100'
              }`}
            >
              DISQUES DURS
            </button>
            <button
              onClick={() => handleNavClick('monitors')}
              className={`p-3 rounded-lg text-left transition-colors ${
                activeSection === 'monitors'
                  ? 'text-white bg-[#D71920]'
                  : 'text-zinc-800 bg-zinc-50 hover:bg-zinc-100'
              }`}
            >
              MONITEURS
            </button>
            <button
              onClick={() => handleNavClick('network')}
              className={`p-3 rounded-lg text-left transition-colors ${
                activeSection === 'network'
                  ? 'text-white bg-[#D71920]'
                  : 'text-zinc-800 bg-zinc-50 hover:bg-zinc-100'
              }`}
            >
              RÉSEAU & SWITCH
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`p-3 rounded-lg text-left transition-colors ${
                activeSection === 'about'
                  ? 'text-white bg-[#D71920]'
                  : 'text-zinc-800 bg-zinc-50 hover:bg-zinc-100'
              }`}
            >
              À PROPOS
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            <a
              href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite passer commande.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-center text-xs font-black uppercase text-white bg-[#D71920] rounded-lg shadow-md flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              Commander via WhatsApp (+261 33 75 565 84)
            </a>
            <button
              onClick={() => {
                onOpenQA();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-zinc-500 py-1 text-center hover:text-zinc-800 flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D71920]" />
              Audit des données et conformité Excel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
