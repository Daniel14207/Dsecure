import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        'Pour la sécurisation de notre entrepôt et de nos quais de chargement, D SECURE a installé un système 16 caméras Hikvision ColorVu avec vision nocturne couleur. La netteté des plaques et des visages est irréprochable même dans l\'obscurité totale.',
      author: 'Andry R.',
      role: 'Responsable Logistique & Sûreté',
      company: 'Zone Industrielle Tanjombato, Antananarivo',
      rating: 5,
    },
    {
      id: 2,
      quote:
        'L\'alarme sans fil Hikvision AX PRO avec les détecteurs PIRCAM est une révolution. Dès qu\'un mouvement est détecté la nuit, je reçois instantanément la séquence photo sur mon téléphone à Antananarivo ou en déplacement à l\'étranger.',
      author: 'Mialy R.',
      role: 'Propriétaire de Résidence',
      company: 'Résidence Privée, Ivandry',
      rating: 5,
    },
    {
      id: 3,
      quote:
        'Excellent service avant et après-vente. Le calcul des prix est limpide et la livraison avec paramétrage sur notre réseau local s\'est faite en moins de 48 heures. Nous recommandons vivement l\'équipe D SECURE.',
      author: 'Herizo T.',
      role: 'Directeur d\'Exploitation',
      company: 'Complexe Tertiaire, Ankorondrano',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#D71920] mb-3">
            <span>Retours d'expérience</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            La Confiance de nos Clients à Madagascar
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Entreprises, plateformes logistiques et résidences privées font confiance à D SECURE pour la protection de leurs biens et collaborateurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#080808] rounded-xl border border-zinc-800/80 p-6 flex flex-col justify-between relative group hover:border-zinc-700 transition-colors"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-zinc-700 mb-3 group-hover:text-[#D71920] transition-colors" />

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.author}</h4>
                  <p className="text-[11px] text-zinc-400">{item.role}</p>
                  <p className="text-[10px] text-zinc-500">{item.company}</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
