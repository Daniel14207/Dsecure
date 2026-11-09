import React from 'react';
import { Star, Building2, Factory, UserCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'TMT',
      icon: Building2,
      rating: 5,
      comment:
        'Service professionnel et rapide. Installation parfaite, matériel de qualité. Je recommande D SECURE.',
    },
    {
      id: 2,
      name: 'GEO TEXTILE',
      icon: Factory,
      rating: 5,
      comment:
        'Très satisfait de notre système de vidéosurveillance. Équipe sérieuse et compétente.',
    },
    {
      id: 3,
      name: 'MR FACROUDINE GIEGO',
      icon: UserCheck,
      rating: 5,
      comment:
        'Très bon service après-vente, réactif et à l\'écoute. Merci D SECURE !',
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title matching design reference */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#080808] tracking-tight uppercase">
            AVIS <span className="text-[#D71920]">CLIENTS</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 font-medium">
            Témoignages vérifiés d'entreprises et particuliers partenaires à Madagascar
          </p>
        </div>

        {/* 3 Testimonials Cards matching design-reference.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
                      <Icon className="w-5 h-5 text-[#D71920]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                        {item.name}
                      </h4>
                      {/* 5 Yellow Stars matching design reference */}
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
