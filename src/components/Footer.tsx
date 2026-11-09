import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Lock } from 'lucide-react';
import { ActiveSection } from '../types/product';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { DSecureLogo } from './DSecureLogo';
import { OfficialWhatsAppIcon, OfficialGmailIcon, OfficialFacebookIcon } from './OfficialSocialIcons';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#080808] border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <DSecureLogo variant="dark" size="md" />

            <p className="text-zinc-300 text-xs leading-relaxed max-w-sm mt-3">
              D SECURE est votre partenaire de confiance pour tous vos besoins en sécurité électronique à Madagascar : vidéosurveillance CCTV, alarmes anti-intrusion et contrôle d'accès.
            </p>

            {/* Official Social Icons matching design reference */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="Facebook D SECURE"
              >
                <OfficialFacebookIcon size={32} />
              </a>

              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                aria-label="WhatsApp D SECURE"
              >
                <OfficialWhatsAppIcon size={32} />
              </a>

              <a
                href="mailto:dsecure.mg@gmail.com"
                className="hover:scale-110 transition-transform"
                aria-label="Email D SECURE"
              >
                <OfficialGmailIcon size={32} />
              </a>
            </div>
          </div>

          {/* Col 2: LIENS SERVICES */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              LIENS SERVICES
            </h4>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cameras')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Produits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packs')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Packs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alarms')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Alarmes
                </button>
              </li>
              <li>
                <a
                  href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite passer commande.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D71920] transition-colors block"
                >
                  Commander
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: NOS PRODUITS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              NOS PRODUITS
            </h4>
            <ul className="space-y-2 text-zinc-300">
              <li>
                <button
                  onClick={() => onNavigate('cameras')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Caméras IP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cameras')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Caméras Analogiques
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alarms')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Alarmes AX PRO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dvr_nvr')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  DVR et NVR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('accessories')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Accessoires & Câbles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hdd')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Disques durs de surveillance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('network')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Réseau & Switch PoE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('monitors')}
                  className="hover:text-[#D71920] transition-colors"
                >
                  Moniteurs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: CONTACTEZ-NOUS & HORAIRES */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              CONTACTEZ-NOUS
            </h4>
            <div className="space-y-3">
              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors text-zinc-300 group"
              >
                <OfficialWhatsAppIcon size={20} />
                <span className="font-bold group-hover:text-emerald-400 transition-colors">+261 33 75 565 84</span>
              </a>

              <a
                href="mailto:dsecure.mg@gmail.com"
                className="flex items-center gap-2.5 hover:text-white transition-colors text-zinc-300 group"
              >
                <OfficialGmailIcon size={20} />
                <span className="font-medium group-hover:text-red-400 transition-colors">dsecure.mg@gmail.com</span>
              </a>

              <a
                href="mailto:camhtech.mg@gmail.com"
                className="flex items-center gap-2.5 hover:text-white transition-colors text-zinc-400 group text-[11px]"
              >
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>camhtech.mg@gmail.com</span>
              </a>

              <div className="pt-2 border-t border-zinc-900 space-y-1 text-zinc-400">
                <span className="font-bold text-white uppercase text-[10px] block">HORAIRES</span>
                <p>Lundi - Samedi : 08h00 - 18h00</p>
                <p>Dimanche : Sur rendez-vous</p>
                <p className="text-zinc-500">Antananarivo, Madagascar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© 2025 D SECURE. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Mentions légales</span>
            <span>|</span>
            <span className="hover:text-zinc-400 cursor-pointer">Politique de confidentialité</span>
            <span>|</span>
            {/* Discrete owner access link to the administrative portal */}
            <button
              onClick={() => onNavigate('admin')}
              className="text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
              title="Portail de gestion interne"
            >
              <Lock className="w-3 h-3" />
              <span>Accès Gestionnaire</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
