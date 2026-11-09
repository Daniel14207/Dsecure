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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white border border-zinc-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h3 className="text-base font-black text-zinc-950">Demande de devis & Étude technique</h3>
            <p className="text-xs text-zinc-500 font-medium">D SECURE Madagascar · Réponse rapide sous 24h</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Service souhaité *
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-zinc-50 text-sm text-zinc-900 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            >
              {servicesList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Votre nom complet / Entreprise *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Andry Rakoto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#D71920]" />
              <span>Numéro WhatsApp joignable *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Ex: 033 75 565 84"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
              <span>Précisions sur vos locaux et besoins *</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Ex: Maison à étage à Ivandry, besoin de 4 caméras extérieures et 1 alarme..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-700/20"
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
