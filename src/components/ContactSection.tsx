import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, MessageSquare, User } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Demande d\'information générale');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `NOUVEAU MESSAGE CONTACT – D SECURE\n\n`;
    text += `Bonjour D SECURE,\n\n`;
    text += `Sujet: ${subject}\n`;
    text += `Nom: ${name.trim() || 'Non renseigné'}\n`;
    text += `Téléphone: ${phone.trim() || 'Non renseigné'}\n\n`;
    text += `Message:\n${message.trim() || 'Demande de contact.'}\n\n`;
    text += `Merci de me répondre sur ce numéro WhatsApp.`;

    window.open(getDirectWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#080808] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#D71920] mb-3">
            <span>Contact & Devis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Contactez l'Équipe D SECURE
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Une question technique, une demande de prix pour un projet ou un besoin de dépannage ? Notre équipe commerciale et technique est à votre écoute directe sur WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-5">
              <h3 className="text-base font-bold text-white">Nos Canaux Directs</h3>

              <div className="space-y-4 text-xs text-zinc-300">
                <a
                  href={getDirectWhatsAppUrl('Bonjour D SECURE, je vous écris pour une demande de renseignements.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3.5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#D71920]/20 text-[#D71920] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">WhatsApp & Hotline</span>
                    <strong className="text-sm font-mono text-white group-hover:text-[#D71920] transition-colors">
                      +261 33 75 565 84
                    </strong>
                  </div>
                </a>

                <a
                  href="mailto:camhtech.mg@gmail.com"
                  className="p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3.5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Courrier Électronique</span>
                    <strong className="text-sm text-white group-hover:text-zinc-200 transition-colors">
                      camhtech.mg@gmail.com
                    </strong>
                  </div>
                </a>

                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Horaires d'accueil</span>
                    <strong className="text-xs text-white block">
                      Lun - Ven : 08h00 - 18h00
                    </strong>
                    <span className="text-zinc-400 text-[11px]">Samedi : 08h30 - 13h00</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Siège & Zone d'activité</span>
                    <strong className="text-xs text-white block">
                      Antananarivo, Madagascar
                    </strong>
                    <span className="text-zinc-400 text-[11px]">Interventions sur toute la Grande Île</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Right (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-xl">
              <h3 className="text-base font-bold text-white mb-1">
                Envoyer un message à l'équipe commerciale
              </h3>
              <p className="text-xs text-zinc-400 mb-6">
                Remplissez ce formulaire et notre conseiller vous contactera instantanément sur votre numéro WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D71920]" /> Votre nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom ou société"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#D71920]" /> Numéro WhatsApp joignable *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="033 75 565 84 / 034..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Objet de votre demande *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-900 text-sm text-white rounded-lg px-3.5 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="Demande de prix équipement">Demande de prix équipement (Caméras / Alarmes)</option>
                    <option value="Demande d'étude et devis d'installation">Demande d'étude & devis d'installation</option>
                    <option value="Disponibilité d'une référence Hikvision">Disponibilité d'une référence précise</option>
                    <option value="Demande de maintenance ou assistance">Demande de maintenance / SAV</option>
                    <option value="Autre demande professionnelle">Autre demande professionnelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Votre message ou liste de références recherchées *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Précisez votre demande, les quantités envisagées ou les contraintes de votre site..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2.5 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer mon message directement sur WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
