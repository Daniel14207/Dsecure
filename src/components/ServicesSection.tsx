import React from 'react';
import { Camera, Wrench, Settings, Smartphone, Lock, Headphones, FileText, ArrowUpRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForQuote,
}) => {
  const services = [
    {
      id: 'vente',
      title: 'Vente de caméras & équipement',
      description:
        'Large catalogue de matériel officiel Hikvision en direct : caméras IP, Analogiques Turbo HD, thermiques, PTZ et enregistreurs NVR/DVR avec garantie constructeur.',
      icon: Camera,
      badge: 'Équipements certifiés',
      features: ['Stock local disponible à Madagascar', 'Produits 100% neufs sous emballage', 'Tarification transparente ×2 catalogue'],
    },
    {
      id: 'installation',
      title: 'Installation professionnelle',
      description:
        'Pose rigoureuse par nos techniciens spécialisés en sécurité électronique : tirage de câbles Cat6/coaxial, paramétrage réseau, orientation des optiques et mise en service complète.',
      icon: Wrench,
      badge: 'Techniciens certifiés',
      features: ['Pose esthétique et discrète', 'Câblage structuré dans goulottes/tubes', 'Optimisation des angles de vue'],
    },
    {
      id: 'maintenance',
      title: 'Maintenance & entretien',
      description:
        'Contrats de maintenance préventive et curative : nettoyage des objectifs, vérification des disques durs d\'enregistrement, mise à jour des firmwares et remplacement rapide de pièces.',
      icon: Settings,
      badge: 'Pérennité du système',
      features: ['Contrôle d\'intégrité des enregistrements', 'Vérification des blocs d\'alimentation', 'Rapports d\'intervention détaillés'],
    },
    {
      id: 'surveillance',
      title: 'Surveillance à distance',
      description:
        'Accès vidéo en direct et relecture sécurisée depuis votre smartphone ou PC via l\'application Hik-Connect. Notifications instantanées en cas d\'intrusion ou de mouvement.',
      icon: Smartphone,
      badge: 'Accès 24h/24 7j/7',
      features: ['Configuration Hik-Connect & Cloud', 'Alertes intelligentes sur smartphone', 'Consultation sécurisée depuis l\'étranger'],
    },
    {
      id: 'controle',
      title: 'Contrôle d\'accès',
      description:
        'Sécurisation des accès aux bureaux, résidences et zones sensibles : badges RFID/Mifare, claviers codés, gâches électriques et interphonie vidéo connectée.',
      icon: Lock,
      badge: 'Haute sécurité',
      features: ['Lecteurs de badges & télécommandes', 'Historique des passages et entrées', 'Systèmes autonomes ou centralisés'],
    },
    {
      id: 'assistance',
      title: 'Assistance technique',
      description:
        'Support client réactif basé à Madagascar pour vous accompagner : réinitialisation de mot de passe, extraction de séquences vidéo pour la police/assurance et diagnostic à distance.',
      icon: Headphones,
      badge: 'Support local',
      features: ['Hotline WhatsApp directe', 'Télé-assistance rapide', 'Dépannage sur site à Antananarivo'],
    },
    {
      id: 'etude',
      title: 'Étude et devis gratuit',
      description:
        'Visite technique sur site sans engagement pour évaluer vos vulnérabilités, modéliser le nombre exact de caméras requis et vous proposer la solution optimale selon votre budget.',
      icon: FileText,
      badge: '100% Sans engagement',
      features: ['Visite de vos locaux à Antananarivo', 'Schéma d\'implantation technique', 'Devis chiffré clair et immédiat'],
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#D71920] mb-3">
            <span>Savoir-Faire D SECURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Nos Services Professionnels
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            De l'étude technique sur plan jusqu'à l'installation certifiée et la maintenance, D SECURE vous accompagne à chaque étape de votre sécurisation à Madagascar.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-[#080808] rounded-xl border border-zinc-800/80 hover:border-zinc-700 p-6 flex flex-col justify-between transition-all hover:-translate-y-1 group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D71920] group-hover:border-[#D71920]/60 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-zinc-200 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-900 text-xs text-zinc-300">
                    {service.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[#D71920] font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900">
                  <button
                    onClick={() => onSelectServiceForQuote(service.title)}
                    className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-[#D71920] text-zinc-200 hover:text-white text-xs font-bold rounded-lg border border-zinc-800 hover:border-red-600 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Demander un devis WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
