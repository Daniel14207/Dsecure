import React from 'react';
import { Shield, Clock, MapPin, CheckCircle, Award, Phone, Mail } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#080808] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* About text Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#D71920]">
              <span>À Propos de D SECURE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              L'Excellence de la Sécurité Électronique à Madagascar
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Basée à Madagascar, <strong>D SECURE</strong> est une entreprise spécialisée dans la distribution, l'installation et la maintenance de solutions complètes de vidéosurveillance CCTV, systèmes d'alarme intrusion, interphonie et contrôle d'accès.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Face aux enjeux sécuritaires des entreprises, banques, commerces et résidences privées sur la Grande Île, nous avons fait le choix de la qualité absolue en proposant exclusivement du <strong>matériel authentique Hikvision</strong>, leader mondial des solutions vidéo et IoT.
            </p>

            {/* Commitments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 text-[#D71920] flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Matériel 100% Neuf & Original</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tous nos produits proviennent des circuits officiels certifiés, garantissant conformité logicielle et longévité.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 text-[#D71920] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Expertise Technique</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Nos techniciens maîtrisent les configurations réseau avancées, PoE, caméras solaires 4G et alarmes sans fil.
                </p>
              </div>
            </div>

            {/* Opening hours & contact card */}
            <div className="p-5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D71920]" />
                Horaires d'ouverture & Permanence technique
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                <div>
                  <span className="text-zinc-200 font-semibold block">Lundi au Vendredi :</span>
                  <span>08h00 – 18h00 en continu</span>
                </div>
                <div>
                  <span className="text-zinc-200 font-semibold block">Samedi :</span>
                  <span>08h30 – 13h00 (Astreinte disponible)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card / Trust Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D71920]" />
                Coordonnées D SECURE
              </h3>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Localisation :</strong>
                    <span>Antananarivo, Madagascar</span>
                    <span className="text-zinc-500 block">Interventions sur Antananarivo et en provinces sur devis</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">WhatsApp & Téléphone :</strong>
                    <a
                      href={getDirectWhatsAppUrl('Bonjour D SECURE, je vous contacte depuis votre site web.')}
                      className="text-[#D71920] font-mono font-bold hover:underline"
                    >
                      +261 33 75 565 84
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Email professionnel :</strong>
                    <a
                      href="mailto:camhtech.mg@gmail.com"
                      className="text-zinc-200 hover:text-white hover:underline"
                    >
                      camhtech.mg@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Stylized Google Maps Location Placeholder as requested */}
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 relative aspect-16/9 flex flex-col items-center justify-center p-4 text-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d71920_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="w-10 h-10 rounded-full bg-[#D71920]/20 border border-[#D71920] flex items-center justify-center text-[#D71920] mb-2 z-10 animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white z-10">Antananarivo, Madagascar</span>
                <span className="text-[11px] text-zinc-400 z-10 mt-0.5">
                  Zone d'intervention opérationnelle & expéditions régionales
                </span>
              </div>

              <div className="pt-2">
                <a
                  href={getDirectWhatsAppUrl('Bonjour D SECURE, j\'aimerais convenir d\'un rendez-vous.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Prendre contact sur WhatsApp (+261 33 75 565 84)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
