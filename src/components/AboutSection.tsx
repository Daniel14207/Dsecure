import React from 'react';
import { Shield, Clock, MapPin, Award, Phone, Mail } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* About text Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-[#D71920]">
              <span>À Propos de D SECURE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#080808] tracking-tight leading-tight uppercase">
              L'EXCELLENCE DE LA SÉCURITÉ ÉLECTRONIQUE À MADAGASCAR
            </h2>

            <p className="text-sm sm:text-base text-zinc-700 leading-relaxed font-normal">
              Basée à Madagascar, <strong>D SECURE</strong> est une entreprise de référence spécialisée dans la distribution, l'installation et la maintenance de solutions complètes de vidéosurveillance CCTV, systèmes d'alarme anti-intrusion, interphonie et contrôle d'accès.
            </p>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Face aux enjeux de sécurité des entreprises, banques, commerces et résidences privées sur la Grande Île, nous avons fait le choix de la rigueur et de la fiabilité en proposant exclusivement du <strong>matériel authentique Hikvision</strong>, leader mondial des solutions vidéo et de sûreté électronique.
            </p>

            {/* Commitments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-[#D71920] flex items-center justify-center shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-zinc-900">Matériel 100% Neuf & Original</h4>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Tous nos produits proviennent des circuits officiels certifiés, garantissant conformité logicielle et longévité.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 text-[#D71920] flex items-center justify-center shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-extrabold text-zinc-900">Expertise Technique</h4>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Nos techniciens maîtrisent les configurations réseau avancées, PoE, caméras solaires 4G et alarmes sans fil.
                </p>
              </div>
            </div>

            {/* Opening hours & contact card */}
            <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D71920]" />
                Horaires d'ouverture & Permanence technique
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-600">
                <div>
                  <span className="text-zinc-900 font-bold block">Lundi au Samedi :</span>
                  <span>08h00 – 18h00 en continu</span>
                </div>
                <div>
                  <span className="text-zinc-900 font-bold block">Dimanche :</span>
                  <span>Sur rendez-vous (Astreinte d'urgence)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card / Trust Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-md space-y-5">
              <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D71920]" />
                Coordonnées D SECURE
              </h3>

              <div className="space-y-3 text-xs text-zinc-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-950 block">Localisation :</strong>
                    <span>Antananarivo, Madagascar</span>
                    <span className="text-zinc-500 block">Interventions sur Antananarivo et en provinces sur devis</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-950 block">WhatsApp & Téléphone :</strong>
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
                    <strong className="text-zinc-950 block">Emails professionnels :</strong>
                    <div className="space-y-0.5 mt-0.5">
                      <a href="mailto:dscure.mg@gmail.com" className="text-zinc-800 hover:text-[#D71920] block font-medium">
                        dscure.mg@gmail.com
                      </a>
                      <a href="mailto:camhtech.mg@gmail.com" className="text-zinc-600 hover:text-[#D71920] block font-medium">
                        camhtech.mg@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location map indicator */}
              <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 relative aspect-16/9 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-[#D71920] mb-2 z-10">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-zinc-900 z-10">Antananarivo, Madagascar</span>
                <span className="text-[11px] text-zinc-500 z-10 mt-0.5">
                  Zone d'intervention opérationnelle & expéditions régionales
                </span>
              </div>

              <div className="pt-2">
                <a
                  href={getDirectWhatsAppUrl('Bonjour D SECURE, j\'aimerais convenir d\'un rendez-vous.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-black uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
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
