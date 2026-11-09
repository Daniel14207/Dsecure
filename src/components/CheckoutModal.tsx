import React, { useState } from 'react';
import { CartItem, OrderCustomerInfo, Product } from '../types/product';
import { X, Send, Phone, CheckCircle, ArrowLeft, ShieldCheck, MapPin, User, MessageSquare } from 'lucide-react';
import { formatAr, generateCartOrderWhatsAppUrl, generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: CartItem[];
  singleProduct?: { product: Product; quantity: number } | null;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  singleProduct = null,
  onOrderSuccess,
}) => {
  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  });

  const [step, setStep] = useState<'form' | 'review'>('form');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Determine items list
  const activeItems: CartItem[] = singleProduct
    ? [{ product: singleProduct.product, quantity: singleProduct.quantity }]
    : cartItems;

  const orderTotal = activeItems.reduce((sum, item) => {
    return sum + (item.product.sellingPriceAr || 0) * item.quantity;
  }, 0);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!customer.phone.trim()) {
      setErrorMsg('Veuillez renseigner un numéro de téléphone joignable.');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMsg('Veuillez indiquer votre adresse ou ville de livraison.');
      return;
    }
    setErrorMsg('');
    setStep('review');
  };

  const handleOpenWhatsApp = () => {
    let url = '';
    if (singleProduct) {
      url = generateSingleProductWhatsAppUrl(
        singleProduct.product,
        singleProduct.quantity,
        customer
      );
    } else {
      url = generateCartOrderWhatsAppUrl(activeItems, customer);
    }

    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
    onOrderSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D71920]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {step === 'form' ? 'Finalisation de la commande' : 'Récapitulatif avant confirmation'}
              </h3>
              <p className="text-xs text-zinc-400">
                Liaison directe avec le service commercial D SECURE (+261 33 75 565 84)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Items summary strip */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-2">
                  Articles à commander ({activeItems.length})
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {activeItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-zinc-900 last:border-0"
                    >
                      <div className="truncate pr-2">
                        <span className="font-mono text-[#D71920] font-semibold">
                          {item.product.reference}
                        </span>{' '}
                        <span className="text-zinc-300">· {item.product.name}</span>{' '}
                        <span className="text-zinc-500 font-mono">× {item.quantity}</span>
                      </div>
                      <span className="font-mono font-semibold text-white whitespace-nowrap">
                        {item.product.sellingPriceAr
                          ? formatAr(item.product.sellingPriceAr * item.quantity)
                          : 'Sur devis'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between items-baseline text-xs font-bold text-white">
                  <span>Total de la commande</span>
                  <span className="text-sm font-mono text-[#D71920]">{formatAr(orderTotal)}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D71920]" /> Nom et Prénom du client *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Jean Ravelo / Société Alpha"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D71920]" /> Numéro de téléphone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: 033 75 565 84 / 034 00 000 00"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D71920]" /> Adresse ou Ville de livraison *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Antananarivo - Ankorondrano / Tamatave..."
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500" /> Instructions particulières / Demande d'installation (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Précisez si vous souhaitez aussi l'installation, le câblage ou un créneau particulier..."
                    value={customer.note}
                    onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                    className="w-full bg-zinc-900 text-sm text-white placeholder-zinc-500 rounded-lg px-3.5 py-2 border border-zinc-800 focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              {/* Submit to review */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
                >
                  <span>Vérifier et générer le message WhatsApp</span>
                </button>
              </div>
            </form>
          ) : (
            /* Review Step */
            <div className="space-y-5">
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Récapitulatif officiel de votre commande
                </h4>

                <div className="text-xs space-y-1 text-zinc-300">
                  <p><span className="text-zinc-500">Client :</span> <strong>{customer.fullName}</strong></p>
                  <p><span className="text-zinc-500">Téléphone :</span> <strong className="font-mono">{customer.phone}</strong></p>
                  <p><span className="text-zinc-500">Livraison :</span> <strong>{customer.address}</strong></p>
                  {customer.note && (
                    <p><span className="text-zinc-500">Remarques :</span> {customer.note}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-xs font-medium text-zinc-400 block mb-1">
                    Équipements sélectionnés :
                  </span>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {activeItems.map((item) => (
                      <div key={item.product.id} className="text-xs flex justify-between py-0.5">
                        <span className="text-zinc-200">
                          {item.quantity}× {item.product.name} ({item.product.reference})
                        </span>
                        <span className="font-mono text-white">
                          {formatAr((item.product.sellingPriceAr || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline font-bold">
                  <span className="text-sm text-white">MONTANT TOTAL DE LA COMMANDE</span>
                  <span className="text-base font-mono text-[#D71920]">{formatAr(orderTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900 text-xs text-zinc-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  En cliquant sur le bouton ci-dessous, l'application WhatsApp s'ouvrira directement avec votre message pré-rempli. Vous n'aurez plus qu'à appuyer sur <strong>Envoyer</strong> pour confirmer avec notre équipe.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-lg border border-zinc-800 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modifier les informations</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex-1 py-3 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la commande via WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
