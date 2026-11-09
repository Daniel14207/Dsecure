import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { ActiveSection } from '../types/product';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';
import { DSecureLogo } from './DSecureLogo';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenQA: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQA }) => {
  return (
    <footer className="bg-[#080808] border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Presentation matching design reference */}
          <div className="lg:col-span-2 space-y-4">
            <DSecureLogo variant="dark" size="md" />

            <p className="text-zinc-300 text-xs leading-relaxed max-w-sm mt-3">
              D SECURE est votre partenaire de confiance pour tous vos besoins en sécurité électronique à Madagascar : vidéosurveillance CCTV, alarmes anti-intrusion et contrôle d'accès.
            </p>

            {/* Social Icons matching design reference (FB, IG, YT, WA) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook D SECURE"
              >
                <span className="font-black text-xs">f</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center transition-opacity hover:opacity-90 shadow-sm"
                aria-label="Instagram D SECURE"
              >
                <span className="font-bold text-[10px]">IG</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="YouTube D SECURE"
              >
                <span className="font-bold text-[10px]">YT</span>
              </a>

              {/* WhatsApp */}
              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="WhatsApp D SECURE"
              >
                <Phone className="w-4 h-4 fill-white" />
              </a>
            </div>
          </div>

          {/* Col 2: LIENS SERVICES matching design-reference.png */}
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

          {/* Col 3: NOS PRODUITS matching design-reference.png */}
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

          {/* Col 4: CONTACTEZ-NOUS & HORAIRES matching design-reference.png */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              CONTACTEZ-NOUS
            </h4>
            <div className="space-y-2.5">
              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors text-zinc-300"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Phone className="w-3 h-3 fill-white" />
                </div>
                <span>+261 33 75 565 84</span>
              </a>

              <a
                href="mailto:dscure.mg@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors text-zinc-300"
              >
                <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 font-bold text-[10px]">
                  M
                </div>
                <span>dscure.mg@gmail.com</span>
              </a>

              <a
                href="mailto:camhtech.mg@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors text-zinc-400"
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

              <div className="pt-2">
                <button
                  onClick={onOpenQA}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors text-[10px] underline"
                >
                  Audit et conformité des données Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching design reference */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© 2025 D SECURE. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Mentions légales</span>
            <span>|</span>
            <span className="hover:text-zinc-400 cursor-pointer">Politique de confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
