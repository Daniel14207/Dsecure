import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageSquare, Phone, X, Send } from 'lucide-react';
import { getDirectWhatsAppUrl } from '../utils/whatsapp';

interface FloatingWidgetsProps {
  onOpenLiveChat?: () => void;
}

export const FloatingWidgets: React.FC<FloatingWidgetsProps> = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartWhatsAppChat = () => {
    const text = chatMessage.trim()
      ? `Bonjour D SECURE, ${chatMessage.trim()}`
      : 'Bonjour D SECURE, j\'aimerais avoir des informations sur vos équipements de sécurité.';
    window.open(getDirectWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
    setIsChatOpen(false);
    setChatMessage('');
  };

  return (
    <>
      {/* Floating Action Buttons matching design reference (left side) */}
      <div className="fixed left-4 bottom-6 z-40 flex flex-col items-center gap-2.5">
        {/* Chat en ligne badge */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="relative bg-[#D71920] hover:bg-[#b8141a] text-white p-2.5 sm:px-3 sm:py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
          aria-label="Ouvrir le chat en ligne"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span className="hidden sm:inline text-[11px]">CHAT EN LIGNE</span>
        </button>

        {/* Floating WhatsApp Bubble */}
        <a
          href={getDirectWhatsAppUrl('Bonjour D SECURE, je souhaite passer commande.')}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1faa53] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
          aria-label="Contacter via WhatsApp"
        >
          <Phone className="w-6 h-6 fill-white" />
        </a>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-md bg-[#D71920] hover:bg-[#b8141a] text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Interactive Chat Popup Widget matching design-reference.png */}
      {isChatOpen && (
        <div className="fixed right-4 bottom-6 sm:right-6 sm:bottom-6 z-50 w-80 sm:w-90 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-[#080808] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-xs tracking-wider">Chat en ligne</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-zinc-400 hover:text-white p-1"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-zinc-50 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#D71920] text-white flex items-center justify-center text-xs font-bold shrink-0">
                DS
              </div>
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-zinc-200 text-xs text-zinc-800 shadow-xs">
                <span className="font-bold block text-zinc-900 mb-1">D SECURE Support</span>
                Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?
              </div>
            </div>

            <div className="text-[11px] text-zinc-600 flex items-center gap-1.5 justify-center py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Nous sommes en ligne sur WhatsApp</span>
            </div>
          </div>

          {/* Quick Input / CTA */}
          <div className="p-3 bg-white border-t border-zinc-200 space-y-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartWhatsAppChat()}
              className="w-full text-xs p-2.5 bg-zinc-100 rounded-lg border border-zinc-200 focus:outline-none focus:border-[#D71920]"
            />
            <button
              onClick={handleStartWhatsAppChat}
              className="w-full py-2.5 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Démarrer une conversation</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
