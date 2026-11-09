import React, { useState } from 'react';
import { X, Send, Phone, User, MessageSquare } from 'lucide-react';
import { generateServiceQuoteWhatsAppUrl } from '../utils/whatsapp';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Étude et devis gratuit',
}) => {
  const [service, setService] = useState(initialService);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateServiceQuoteWhatsAppUrl(
      service,
      name.trim() || 'Client D SECURE',
      phone.trim() || 'Non renseigné',
      details.trim() || 'Demande d\'étude sur site pour sécurisation de locaux.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const servicesList = [
    'Étude et devis gratuit',
    'Installation professionnelle',
    'Vente de caméras & équipement',
    'Maintenance & Entretien',
    'Surveillance à distance & Cloud',
    'Contrôle d\'accès & Badge',
    'Assistance technique & Dépannage',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-white">Demande de devis & Étude technique</h3>
            <p className="text-xs text-zinc-400">D SECURE Madagascar · Réponse rapide sous 24h</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Service souhaité *
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-zinc-900 text-sm text-white rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            >
              {servicesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D71920]" /> Votre nom ou raison sociale *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Rija Rakoto / Entreprise..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D71920]" /> Numéro de téléphone / WhatsApp *
            </label>
            <input
              type="tel"
              required
              placeholder="ex: 033 75 565 84"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Détails de votre projet (lieu, nombre de caméras, locaux...)
            </label>
            <textarea
              rows={3}
              placeholder="Exemple: Villa à Ivandry, besoin de 4 caméras extérieures ColorVu + alarme sans fil AX PRO avec alertes sur smartphone..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
            >
              <Send className="w-4 h-4" />
              <span>Transmettre ma demande sur WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
