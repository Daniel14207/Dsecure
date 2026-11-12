import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  ThumbsUp,
  ArrowRight,
  MessageCircle,
  FileText,
  X,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  SURVEILLANCE_PACKS,
  SurveillancePack,
  PackComponentBOM,
  formatArPrice
} from '../data/surveillancePacks';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface PacksShowcaseSectionProps {
  onOpenQuote: (packTitle?: string) => void;
}

export const PacksShowcaseSection: React.FC<PacksShowcaseSectionProps> = ({ onOpenQuote }) => {
  // Primary technology tab
  const [techTab, setTechTab] = useState<'analog' | 'ip'>('analog');

  // Sub-family filter
  const [subFamilyFilter, setSubFamilyFilter] = useState<string>('all');

  // Camera count filter
  const [cameraFilter, setCameraFilter] = useState<number | 'all'>('all');

  // Active BOM Modal
  const [selectedPackBOM, setSelectedPackBOM] = useState<SurveillancePack | null>(null);

  // Filtered packs
  const filteredPacks = SURVEILLANCE_PACKS.filter((pack) => {
    if (pack.family !== techTab) return false;
    if (subFamilyFilter !== 'all' && pack.subFamily !== subFamilyFilter) return false;
    if (cameraFilter !== 'all' && pack.camerasCount !== cameraFilter) return false;
    return true;
  });

  // Switch technology and reset subfilters
  const handleSwitchTab = (tab: 'analog' | 'ip') => {
    setTechTab(tab);
    setSubFamilyFilter('all');
    setCameraFilter('all');
  };

  const handleOrderPackWhatsApp = (pack: SurveillancePack) => {
    const bomDetails = pack.bom
      .map(
        (b) =>
          `• ${b.quantity}x ${b.name} (${b.ref}) : ${b.isOffered ? 'OFFERT' : formatArPrice(b.totalPriceAr)}`
      )
      .join('\n');

    const text = `*COMMANDE PACK VIDÉOSURVEILLANCE D SECURE*

Bonjour D SECURE,

Je souhaite commander le pack clé en main suivant :

*${pack.name}*
🏷️ Gamme : ${pack.subFamilyLabel}
⚡ Technologie : ${pack.technology}
📹 Caméras : ${pack.camerasCount} caméras (${pack.resolution})
🌙 Vision de nuit : ${pack.nightVision}
💾 Stockage : ${pack.storage}
💰 *PRIX TOTAL : ${pack.formattedPrice}* (Pose offerte à Antananarivo)

*Nomenclature des matériels inclus :*
${bomDetails}

Merci de me confirmer la disponibilité et de planifier l'installation à Antananarivo.`;

    // Persist real pack order to backend API
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: 'Client Pack Vidéosurveillance',
            phone: 'Contact via WhatsApp',
            address: 'Antananarivo (Pose offerte)',
            note: `Commande Pack: ${pack.name}`,
          },
          items: [
            {
              productId: pack.id,
              reference: pack.id,
              name: pack.name,
              quantity: 1,
              unitPriceAr: pack.totalPriceAr,
              totalPriceAr: pack.totalPriceAr,
              image: pack.image,
            },
          ],
          totalAmountAr: pack.totalPriceAr,
        }),
      }).catch((e) => console.error('Pack order error:', e));
    } catch (e) {
      console.error('Error logging pack order:', e);
    }

    window.open(getDirectWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-zinc-50 border-b border-zinc-200" id="packs-showcase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-[#D71920] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Packs Complets Clés en Main &bull; 100% Hikvision Certifié</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080808] tracking-tight uppercase">
            NOS PACKS <span className="text-[#D71920]">VIDÉOSURVEILLANCE</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 mt-2 font-medium">
            Architectures techniques strictes et garanties : aucune compatibilité compromise, matériel d&apos;origine, calcul automatique transparent et pose offerte à Antananarivo.
          </p>

          {/* Primary Technology Switcher: ANALOGIQUE vs IP NUMÉRIQUE PoE */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex p-1.5 bg-zinc-200/80 rounded-xl shadow-inner border border-zinc-300 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleSwitchTab('analog')}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg text-xs sm:text-sm font-black tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
                  techTab === 'analog'
                    ? 'bg-[#080808] text-white shadow-md'
                    : 'text-zinc-700 hover:text-black hover:bg-zinc-100/60'
                }`}
              >
                <Cpu className={`w-4 h-4 ${techTab === 'analog' ? 'text-[#D71920]' : ''}`} />
                <span>SOLUTIONS ANALOGIQUES (Turbo HD)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchTab('ip')}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-lg text-xs sm:text-sm font-black tracking-wide uppercase transition-all flex items-center justify-center gap-2 ${
                  techTab === 'ip'
                    ? 'bg-[#D71920] text-white shadow-md'
                    : 'text-zinc-700 hover:text-black hover:bg-zinc-100/60'
                }`}
              >
                <Layers className={`w-4 h-4 ${techTab === 'ip' ? 'text-white' : ''}`} />
                <span>SOLUTIONS IP NUMÉRIQUES PoE</span>
              </button>
            </div>
          </div>

          {/* Technology Description Banner */}
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-600 bg-white py-2 px-4 rounded-lg border border-zinc-200 shadow-xs">
            {techTab === 'analog' ? (
              <>
                <span className="font-bold text-zinc-900">Architecture Analogique Turbo HD :</span>
                <span>Caméras haute définition + DVR AcuSense + Câble coaxial blindé + Connecteurs BNC + Bloc C4/C8/C16</span>
              </>
            ) : (
              <>
                <span className="font-bold text-zinc-900">Architecture Réseau IP PoE :</span>
                <span>Caméras IP AcuSense + NVR avec ports PoE natifs + Câble Cat6 RJ45 305m (Zéro bloc secteur externe)</span>
              </>
            )}
          </div>

          {/* Sub-Filters: Gammes & Nombre de caméras */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            {/* Gamme filter for Analog */}
            {techTab === 'analog' && (
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-lg border border-zinc-200">
                <span className="text-[11px] font-bold text-zinc-500 uppercase px-2">Gamme :</span>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'all'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  Toutes
                </button>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('analog-exir')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'analog-exir'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  EXIR Standard
                </button>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('analog-colorvu')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'analog-colorvu'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  Smart ColorVu (Couleur 24/7)
                </button>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('analog-hybrid')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'analog-hybrid'
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  Smart Hybrid Light
                </button>
              </div>
            )}

            {/* Gamme filter for IP */}
            {techTab === 'ip' && (
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-lg border border-zinc-200">
                <span className="text-[11px] font-bold text-zinc-500 uppercase px-2">Gamme :</span>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'all'
                      ? 'bg-[#D71920] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  Toutes
                </button>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('ip-poe')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'ip-poe'
                      ? 'bg-[#D71920] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  IP PoE 2MP AcuSense
                </button>
                <button
                  type="button"
                  onClick={() => setSubFamilyFilter('ip-pro')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    subFamilyFilter === 'ip-pro'
                      ? 'bg-[#D71920] text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  IP PoE Pro 4MP Ultra HD
                </button>
              </div>
            )}

            {/* Camera Count filter */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-zinc-200">
              <span className="text-[11px] font-bold text-zinc-500 uppercase px-2">Format :</span>
              <button
                type="button"
                onClick={() => setCameraFilter('all')}
                className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                  cameraFilter === 'all'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setCameraFilter(4)}
                className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                  cameraFilter === 4
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                4 Caméras
              </button>
              <button
                type="button"
                onClick={() => setCameraFilter(8)}
                className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                  cameraFilter === 8
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                8 Caméras
              </button>
              {techTab === 'analog' && (
                <button
                  type="button"
                  onClick={() => setCameraFilter(16)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    cameraFilter === 16
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  16 Caméras
                </button>
              )}
              {techTab === 'ip' && (
                <button
                  type="button"
                  onClick={() => setCameraFilter(16)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                    cameraFilter === 16
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  16 Caméras
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout: Packs Grid + Why Choose Us Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Packs Grid (9 cols on xl) */}
          <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => (
              <div
                key={pack.id}
                className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Pack Visual & Badges */}
                <div>
                  {/* Top Bar with Badge */}
                  <div className="bg-zinc-950 text-white px-4 py-2.5 flex items-center justify-between border-b border-zinc-800">
                    <span className="text-[11px] font-black uppercase tracking-wider text-red-400 truncate">
                      {pack.subFamilyLabel}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                      {pack.camerasCount} CAMÉRAS
                    </span>
                  </div>

                  {/* Commercial Kit Composite Image */}
                  <div className="relative aspect-16/10 w-full bg-zinc-100 overflow-hidden border-b border-zinc-100 flex items-center justify-center p-3">
                    <img
                      src={pack.image}
                      alt={pack.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // fallback if needed
                        (e.target as HTMLImageElement).src =
                          pack.family === 'ip'
                            ? '/assets/aistudio/ip-1-0_r3_c1_32_eef30959.jpg'
                            : '/assets/aistudio/hikvision-kit_r3_c1_1_295ddbc1.jpg';
                      }}
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-[#D71920] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                        {pack.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Pose Offerte
                      </span>
                    </div>
                  </div>

                  {/* Pack Title & Specs */}
                  <div className="p-5 pb-3">
                    <h3 className="text-sm font-black text-[#080808] uppercase tracking-tight leading-snug group-hover:text-[#D71920] transition-colors">
                      {pack.name}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {pack.tagline}
                    </p>

                    {/* Quick Specs Grid */}
                    <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase font-bold">Résolution</span>
                        <span className="font-bold text-zinc-800 truncate block">{pack.resolution}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase font-bold">Stockage</span>
                        <span className="font-bold text-zinc-800 truncate block">{pack.storage.replace('Disque dur ', '')}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase font-bold">Enregistreur</span>
                        <span className="font-bold text-zinc-800 truncate block">{pack.recorderModel}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] uppercase font-bold">Câblage</span>
                        <span className="font-bold text-zinc-800 truncate block">{pack.cabling}</span>
                      </div>
                    </div>

                    {/* Bullet Highlights */}
                    <div className="mt-3.5 space-y-1.5">
                      {pack.highlights.slice(0, 4).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-zinc-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price, BOM Toggle & CTA Actions */}
                <div className="p-5 pt-3 border-t border-zinc-100 bg-zinc-50/70">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block">Prix Pack Clé en Main</span>
                      <span className="text-xl font-black text-[#080808] font-mono tracking-tight">
                        {pack.formattedPrice}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        Installation Tana : 0 Ar
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleOrderPackWhatsApp(pack)}
                      className="w-full py-2.5 px-3 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>COMMANDER SUR WHATSAPP</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPackBOM(pack)}
                        className="py-2 px-2.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-[11px] font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Nomenclature BOM</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenQuote(pack.name)}
                        className="py-2 px-2.5 bg-zinc-900 hover:bg-black text-white text-[11px] font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Devis officiel</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar: Reassurance & Quotation Callout */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-[#080808] text-white rounded-2xl p-6 shadow-xl border border-zinc-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D71920]/20 text-[#D71920] text-[10px] font-black uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ENGAGEMENT QUALITÉ D SECURE</span>
                </div>

                <h3 className="text-base font-black uppercase tracking-wider text-white mb-4">
                  POURQUOI CHOISIR NOS PACKS ?
                </h3>

                <ul className="space-y-3.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white block font-semibold">100% Hikvision Certifié</strong>
                      <span>Matériels neufs sous scellés, aucune copie générique.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white block font-semibold">Zéro Mélange Technologique</strong>
                      <span>NVR IP avec caméras IP / DVR avec caméras analogiques.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white block font-semibold">Câblage Complet Inclus</strong>
                      <span>Coaxial blindé ou Carton Cat6 305m avec fiches dédiées.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white block font-semibold">Disque Dur 24/7 Dédié</strong>
                      <span>Seagate SkyHawk / WD Purple pour écriture continue sans panne.</span>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-white block font-semibold">Installation Offerte à Tana</strong>
                      <span>Pose, paramétrage enregistreur et appli smartphone offerts.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-4">
                <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#D71920]/20 text-[#D71920] shrink-0">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <span>Garantie constructeur & support technique local à Madagascar.</span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenQuote('Étude personnalisée pack vidéosurveillance')}
                  className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black tracking-wider uppercase rounded-xl shadow-lg transition-all"
                >
                  DEMANDER UNE ÉTUDE SUR-MESURE
                </button>
              </div>
            </div>

            {/* Quick Architecture helper */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm text-xs space-y-3">
              <h4 className="font-black text-zinc-900 uppercase tracking-tight flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#D71920]" />
                <span>Conseil Technique D SECURE</span>
              </h4>
              <p className="text-zinc-600 leading-relaxed">
                Vous hésitez entre <strong>Analogique Turbo HD</strong> et <strong>IP PoE</strong> ?
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-100">
                  <span className="font-bold text-zinc-900 block">Choisissez l&apos;Analogique si :</span>
                  <span className="text-zinc-600">Vous recherchez le meilleur rapport prix/performance ou rénovez un câblage coaxial existant.</span>
                </div>
                <div className="p-2.5 bg-red-50/60 rounded-lg border border-red-100">
                  <span className="font-bold text-[#D71920] block">Choisissez l&apos;IP PoE si :</span>
                  <span className="text-zinc-700">Vous voulez une qualité d&apos;image pure, un seul câble réseau par caméra et l&apos;intelligence artificielle AcuSense.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: NOMENCLATURE DÉTAILLÉE (BILL OF MATERIALS - BOM)  */}
      {/* ========================================================= */}
      {selectedPackBOM && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-zinc-950 text-white p-5 sm:p-6 flex items-start justify-between border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#D71920] text-white">
                    {selectedPackBOM.technology}
                  </span>
                  <span className="text-xs font-bold text-zinc-400">
                    {selectedPackBOM.camerasCount} Caméras &bull; {selectedPackBOM.resolution}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                  {selectedPackBOM.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Nomenclature interne officielle (BOM) & décomposition tarifaire transparente
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPackBOM(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Table of Components */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-[11px] font-black text-zinc-500 uppercase tracking-wider bg-zinc-50">
                      <th className="py-2.5 px-3">Qté</th>
                      <th className="py-2.5 px-3">Référence Hikvision</th>
                      <th className="py-2.5 px-3">Désignation & Rôle</th>
                      <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs text-zinc-800">
                    {selectedPackBOM.bom.map((item: PackComponentBOM, i: number) => (
                      <tr key={i} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#D71920]">
                          {item.quantity}x
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded text-[11px]">
                            {item.ref}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-zinc-900">{item.name}</div>
                          <div className="text-[11px] text-zinc-500">{item.role}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-zinc-600">
                          {item.isOffered ? '0 Ar' : formatArPrice(item.unitPriceAr)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          {item.isOffered ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-sans text-[11px]">
                              OFFERT
                            </span>
                          ) : (
                            formatArPrice(item.totalPriceAr)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="mt-6 p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs text-zinc-600">
                  <span>Sous-total équipements certifiés Hikvision</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {selectedPackBOM.formattedPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-700">
                  <span className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Forfait installation & configuration smartphone à Antananarivo
                  </span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    0 Ar (OFFERT)
                  </span>
                </div>
                <div className="pt-3 border-t border-zinc-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase block">Total Net Clé en Main</span>
                    <span className="text-xl sm:text-2xl font-black text-[#080808] font-mono">
                      {selectedPackBOM.formattedPrice}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 italic">
                    Garantie constructeur & support inclus
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer: Action Buttons */}
            <div className="bg-zinc-100 p-4 sm:p-5 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedPackBOM(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-200 text-xs font-bold uppercase transition-colors"
              >
                Fermer
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const pack = selectedPackBOM;
                    setSelectedPackBOM(null);
                    onOpenQuote(pack.name);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase transition-colors"
                >
                  Devis officiel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const pack = selectedPackBOM;
                    setSelectedPackBOM(null);
                    handleOrderPackWhatsApp(pack);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander sur WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
