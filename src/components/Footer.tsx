import React from 'react';
import { Shield, Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { ActiveSection } from '../types/product';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
  onOpenQA: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenQA }) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Presentation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D71920]">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-white tracking-wider font-mono">
                  D SECURE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold">
                  Madagascar
                </span>
              </div>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed max-w-sm">
              Votre sécurité, notre priorité. Spécialiste à Madagascar des solutions professionnelles de vidéosurveillance CCTV, matériel officiel Hikvision, systèmes d'alarme intrusion et contrôle d'accès.
            </p>

            <div className="pt-2 text-zinc-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[#D71920] font-bold">✓</span>
                <span>Matériel certifié constructeur Hikvision Original</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#D71920] font-bold">✓</span>
                <span>Tarifs transparents calculés sur base officielle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#D71920] font-bold">✓</span>
                <span>Service d'installation et assistance technique locale</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Équipements
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('cameras')}
                  className="hover:text-white transition-colors"
                >
                  Caméras de surveillance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alarms')}
                  className="hover:text-white transition-colors"
                >
                  Systèmes d'alarme AX PRO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packs')}
                  className="hover:text-white transition-colors"
                >
                  Packs vidéosurveillance complets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('accessories')}
                  className="hover:text-white transition-colors"
                >
                  Accessoires, Baies & Disques
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('network')}
                  className="hover:text-white transition-colors"
                >
                  Switch PoE & Réseau Wi-Fi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Société */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Services & Entreprise
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Vente & Distribution
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Installation & Pose sur site
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Maintenance & Dépannage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  À propos de D SECURE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="hover:text-white transition-colors"
                >
                  Avis clients vérifiés
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQA}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Audit données & Traçabilité Excel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Horaires */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contact & Support
            </h4>
            <div className="space-y-2.5">
              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors text-zinc-300"
              >
                <Phone className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                <span>+261 33 75 565 84</span>
              </a>

              <a
                href="mailto:camhtech.mg@gmail.com"
                className="flex items-start gap-2 hover:text-white transition-colors text-zinc-300"
              >
                <Mail className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                <span>camhtech.mg@gmail.com</span>
              </a>

              <div className="flex items-start gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                <span>Antananarivo, Madagascar</span>
              </div>

              <div className="flex items-start gap-2 text-zinc-400">
                <Clock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                <span>Lun - Ven : 8h-18h · Sam : 8h30-13h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© {new Date().getFullYear()} D SECURE Madagascar. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Matériel Hikvision Authentique</span>
            <span>·</span>
            <span>Facturation en Ariary (Ar)</span>
            <span>·</span>
            <a
              href={getDirectWhatsAppUrl('Bonjour D SECURE, j\'ai une question.')}
              className="text-[#D71920] hover:underline flex items-center gap-1 font-medium"
            >
              <span>Support WhatsApp</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
