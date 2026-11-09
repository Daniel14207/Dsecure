import React from 'react';
import { Camera, Wrench, Settings, Smartphone, Lock, Headphones, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForQuote,
}) => {
  const services = [
    {
      id: 'vente',
      title: 'VENTE DE CAMÉRA',
      description: 'Large gamme de caméras Hikvision et accessoires certifiés d\'origine.',
      icon: Camera,
    },
    {
      id: 'installation',
      title: 'INSTALLATION',
      description: 'Installation professionnelle rapide, esthétique et sécurisée par nos techniciens.',
      icon: Wrench,
    },
    {
      id: 'maintenance',
      title: 'MAINTENANCE',
      description: 'Entretien régulier, nettoyage, diagnostic et dépannage de vos systèmes.',
      icon: Settings,
    },
    {
      id: 'surveillance',
      title: 'SURVEILLANCE À DISTANCE',
      description: 'Accédez à vos caméras en direct et relectures depuis smartphone mobile & PC.',
      icon: Smartphone,
    },
    {
      id: 'controle',
      title: "CONTRÔLE D'ACCÈS",
      description: "Solutions de contrôle d'accès biométrique (Fingerprint, Badges RFID, Clavier).",
      icon: Lock,
    },
    {
      id: 'assistance',
      title: 'ASSISTANCE TECHNIQUE',
      description: 'Support technique réactif, accompagnement et formation des utilisateurs.',
      icon: Headphones,
    },
  ];

  return (
    <section id="services" className="py-16 bg-zinc-50/70 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching design reference */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-[#080808] tracking-tight uppercase">
            NOS <span className="text-[#D71920]">SERVICES</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 font-medium">
            Accompagnement complet de la vente jusqu'au support technique partout à Madagascar
          </p>
        </div>

        {/* 6 Services Grid matching design-reference.png */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => onSelectServiceForQuote(service.title)}
                className="bg-white rounded-xl border border-zinc-200/80 hover:border-[#D71920] p-5 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md cursor-pointer group"
              >
                {/* Clean round icon container */}
                <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-800 group-hover:text-[#D71920] group-hover:bg-red-50 group-hover:border-red-200 transition-colors mb-3">
                  <Icon className="w-6 h-6 stroke-[1.5]" />
                </div>

                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 group-hover:text-[#D71920] transition-colors mb-2">
                  {service.title}
                </h3>

                <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
