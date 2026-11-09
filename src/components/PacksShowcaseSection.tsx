import React, { useState } from 'react';
import { Check, ShieldCheck, ThumbsUp, ArrowRight, MessageCircle } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface PacksShowcaseSectionProps {
  onOpenQuote: (packTitle?: string) => void;
}

interface PackData {
  id: string;
  type: 'ip' | 'analog';
  name: string;
  camerasCount: number;
  image: string;
  features: string[];
  priceAr: number;
  formattedPrice: string;
}

export const PacksShowcaseSection: React.FC<PacksShowcaseSectionProps> = ({ onOpenQuote }) => {
  const [packTab, setPackTab] = useState<'ip' | 'analog'>('ip');

  const ipPacks: PackData[] = [
    {
      id: 'pack-ip-4',
      type: 'ip',
      name: 'PACK IP 4',
      camerasCount: 4,
      image: '/assets/aistudio/ip-1-0_r3_c1_32_eef30959.jpg',
      features: [
        '4 Caméras IP Haute Définition',
        'NVR 4 Canaux Hikvision AcuSense',
        'Disque dur 500GB spécial surveillance',
        '1 Carton câble réseau RJ45 (305m)',
        'Connecteurs RJ45 & Alimentations complètes',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 2450000,
      formattedPrice: '2 450 000 Ar',
    },
    {
      id: 'pack-ip-8',
      type: 'ip',
      name: 'PACK IP 8',
      camerasCount: 8,
      image: '/assets/aistudio/ip-1-0_r4_c1_33_11f56b3a.jpg',
      features: [
        '8 Caméras IP Full HD ColorVu',
        'NVR 8 Canaux Hikvision 4K',
        'Disque dur 1TB spécial surveillance',
        '1 Carton câble RJ45 (305m)',
        'Switch PoE + Boîtiers étanches',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 3950000,
      formattedPrice: '3 950 000 Ar',
    },
    {
      id: 'pack-ip-16',
      type: 'ip',
      name: 'PACK IP 16',
      camerasCount: 16,
      image: '/assets/aistudio/ip-2-0_r5_c1_8_8b064d4a.jpg',
      features: [
        '16 Caméras IP 4MP AcuSense IA',
        'NVR 16 Canaux 4K Ultra HD',
        'Disque dur 2TB Seagate SkyHawk',
        '2 Cartons câbles RJ45 (610m)',
        'Switchs PoE 16 ports + Baie murale',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 7500000,
      formattedPrice: '7 500 000 Ar',
    },
    {
      id: 'pack-ip-32',
      type: 'ip',
      name: 'PACK IP 32',
      camerasCount: 32,
      image: '/assets/aistudio/nvr_r6_c1_8_d5977e04.jpg',
      features: [
        '32 Caméras IP Ultra HD Résolution 4K',
        'NVR 32 Canaux Professionnel RAID',
        'Disque dur 4TB surveillance pro',
        '4 Cartons câbles blindés RJ45',
        'Armoire baie réseau 19" complète',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 13950000,
      formattedPrice: '13 950 000 Ar',
    },
  ];

  const analogPacks: PackData[] = [
    {
      id: 'pack-analog-4',
      type: 'analog',
      name: 'PACK ANALOGIQUE 4',
      camerasCount: 4,
      image: '/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg',
      features: [
        '4 Caméras Turbo HD 1080p Smart IR',
        'DVR 4 Canaux AcuSense Hybride',
        'Disque dur 500GB surveillance',
        '4 Câbles coaxiaux pré-sertis 18m',
        'Bloc alimentation répartiteur',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 1400000,
      formattedPrice: '1 400 000 Ar',
    },
    {
      id: 'pack-analog-8',
      type: 'analog',
      name: 'PACK ANALOGIQUE 8',
      camerasCount: 8,
      image: '/assets/aistudio/analog_r23_c1_17_2896f0f9.jpg',
      features: [
        '8 Caméras Turbo HD ColorVu 2MP',
        'DVR 8 Canaux AcuSense 1080p',
        'Disque dur 1TB spécial vidéosurveillance',
        '1 Rouleau câble coaxial KX6 (100m)',
        'Alimentation centralisée 12V 10A',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 2400000,
      formattedPrice: '2 400 000 Ar',
    },
    {
      id: 'pack-analog-16',
      type: 'analog',
      name: 'PACK ANALOGIQUE 16',
      camerasCount: 16,
      image: '/assets/aistudio/analog_r24_c1_11_c40cf9f9.png',
      features: [
        '16 Caméras Turbo HD 3K Vision Nuit',
        'DVR 16 Canaux AcuSense H.265+',
        'Disque dur 2TB Seagate SkyHawk',
        '2 Rouleaux câbles KX6 + BNC cuivre',
        'Alimentation coffret sécurisé 12V 20A',
        'Installation offerte à Antananarivo',
      ],
      priceAr: 4850000,
      formattedPrice: '4 850 000 Ar',
    },
  ];

  const currentPacks = packTab === 'ip' ? ipPacks : analogPacks;

  const handleOrderPackWhatsApp = (pack: PackData) => {
    const text = `NOUVELLE COMMANDE PACK – D SECURE

Bonjour D SECURE,

Je souhaite commander le pack vidéosurveillance clé en main :

Pack: ${pack.name}
Prix: ${pack.formattedPrice}
Inclus:
${pack.features.map((f) => `- ${f}`).join('\n')}

Merci de me confirmer la disponibilité et de planifier l'installation.`;

    window.open(getDirectWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-white border-b border-zinc-200" id="packs-showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title matching design reference */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080808] tracking-tight uppercase">
            NOS PACKS <span className="text-[#D71920]">VIDÉOSURVEILLANCE</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 font-medium">
            Solutions complètes clés en main avec enregistreur, caméras, stockage et pose offerte
          </p>

          {/* Filter Tabs matching design reference */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-lg mt-6 border border-zinc-200">
            <button
              onClick={() => setPackTab('ip')}
              className={`px-6 py-2 text-xs font-black tracking-wider uppercase rounded-md transition-all ${
                packTab === 'ip'
                  ? 'bg-[#D71920] text-white shadow-sm'
                  : 'text-zinc-700 hover:text-black'
              }`}
            >
              IP NUMÉRIQUE
            </button>
            <button
              onClick={() => setPackTab('analog')}
              className={`px-6 py-2 text-xs font-black tracking-wider uppercase rounded-md transition-all ${
                packTab === 'analog'
                  ? 'bg-[#D71920] text-white shadow-sm'
                  : 'text-zinc-700 hover:text-black'
              }`}
            >
              ANALOGIQUE
            </button>
          </div>
        </div>

        {/* Layout: Packs Grid + Why Choose Us Sidebar matching design reference */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Packs Grid (9 cols on xl, or full) */}
          <div className="xl:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {currentPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-xl border border-zinc-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Pack Header & Image */}
                <div>
                  <div className="bg-zinc-900 text-white py-2 px-3 text-center">
                    <span className="text-xs font-black tracking-wider uppercase font-mono">
                      {pack.name}
                    </span>
                  </div>

                  <div className="aspect-4/3 w-full bg-zinc-50 p-3 flex items-center justify-center border-b border-zinc-100">
                    <img
                      src={pack.image}
                      alt={pack.name}
                      className="max-h-full max-w-full object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Included bullets */}
                  <div className="p-4 space-y-2 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D71920] block">
                      Inclus :
                    </span>
                    <ul className="space-y-1.5 text-zinc-700">
                      {pack.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] leading-snug">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="p-4 pt-2 border-t border-zinc-100 bg-zinc-50/50">
                  <div className="text-center mb-3">
                    <span className="text-base sm:text-lg font-black text-[#080808] font-mono">
                      {pack.formattedPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOrderPackWhatsApp(pack)}
                    className="w-full py-2.5 px-3 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>CHOISIR CE PACK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Us Sidebar matching design-reference.png (3 cols) */}
          <div className="xl:col-span-3 bg-[#080808] text-white rounded-xl p-6 shadow-xl border border-zinc-800 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#D71920] mb-4">
                POURQUOI NOUS CHOISIR ?
              </h3>

              <ul className="space-y-3.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-medium">Matériels Hikvision originaux</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-medium">Installation professionnelle</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-medium">Service après-vente fiable</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-medium">Garantie sur tous nos produits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-medium">Surveillance à distance sur smartphone</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="font-medium">Devis gratuit et personnalisé</span>
                </li>
              </ul>
            </div>

            <div className="text-center pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex justify-center text-[#D71920]">
                <ThumbsUp className="w-8 h-8" />
              </div>

              <button
                onClick={() => onOpenQuote('Étude personnalisée pack vidéosurveillance')}
                className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black tracking-wider uppercase rounded-md shadow-md transition-all"
              >
                DEMANDER UN DEVIS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
