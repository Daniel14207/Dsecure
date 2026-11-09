import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, MessageSquare, User } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Demande de prix équipement (Caméras / Alarmes)');
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
    <section id="contact" className="py-16 md:py-24 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-[#D71920] mb-3">
            <span>Contact & Devis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#080808] tracking-tight uppercase">
            CONTACTEZ L'ÉQUIPE <span className="text-[#D71920]">D SECURE</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-500 font-medium">
            Une question technique, une demande de prix pour un projet ou un besoin d'installation ? Notre équipe commerciale et technique est à votre écoute directe sur WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-md space-y-5">
              <h3 className="text-base font-black uppercase tracking-wider text-zinc-950">
                Nos Canaux Directs
              </h3>

              <div className="space-y-4 text-xs text-zinc-700">
                <a
                  href={getDirectWhatsAppUrl('Bonjour D SECURE, je vous écris pour une demande de renseignements.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-zinc-50 hover:bg-red-50/50 rounded-xl border border-zinc-200 flex items-center gap-3.5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] font-bold">WhatsApp Direct</span>
                    <strong className="text-sm font-mono text-zinc-950 group-hover:text-[#D71920] transition-colors">
                      +261 33 75 565 84
                    </strong>
                  </div>
                </a>

                <a
                  href="mailto:dscure.mg@gmail.com"
                  className="p-3.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 flex items-center gap-3.5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-sm">
                    M
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] font-bold">Email Principal</span>
                    <strong className="text-sm text-zinc-950 group-hover:text-[#D71920] transition-colors">
                      dscure.mg@gmail.com
                    </strong>
                  </div>
                </a>

                <a
                  href="mailto:camhtech.mg@gmail.com"
                  className="p-3.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 flex items-center gap-3.5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] font-bold">Email Technique</span>
                    <strong className="text-sm text-zinc-950 group-hover:text-[#D71920] transition-colors">
                      camhtech.mg@gmail.com
                    </strong>
                  </div>
                </a>

                <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] font-bold">Horaires d'accueil</span>
                    <strong className="text-xs text-zinc-950 block">
                      Lun - Sam : 08h00 - 18h00
                    </strong>
                    <span className="text-zinc-500 text-[11px]">Dimanche : Sur rendez-vous</span>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#D71920]" />
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] font-bold">Siège & Zone d'activité</span>
                    <strong className="text-xs text-zinc-950 block">
                      Antananarivo, Madagascar
                    </strong>
                    <span className="text-zinc-500 text-[11px]">Expédition et interventions sur toute la Grande Île</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Right (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 bg-white rounded-2xl border border-zinc-200 shadow-md">
              <h3 className="text-base font-black uppercase tracking-wider text-zinc-950 mb-1">
                Envoyer un message à l'équipe commerciale
              </h3>
              <p className="text-xs text-zinc-500 mb-6 font-medium">
                Remplissez ce formulaire et notre conseiller vous répondra immédiatement sur WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D71920]" /> Votre nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Andry R."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#D71920]" /> Numéro WhatsApp joignable *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="033 75 565 84"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Objet de votre demande *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="Demande de prix équipement (Caméras / Alarmes)">Demande de prix équipement (Caméras / Alarmes)</option>
                    <option value="Demande d'étude et devis d'installation">Demande d'étude & devis d'installation</option>
                    <option value="Disponibilité d'une référence Hikvision">Disponibilité d'une référence Hikvision</option>
                    <option value="Demande de maintenance ou assistance">Demande de maintenance ou assistance</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500" /> Votre message ou questions *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Précisez vos besoins : type de site à sécuriser, nombre de caméras..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-black tracking-wider uppercase text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-red-700/20"
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
