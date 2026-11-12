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

    // Persist real order to backend API for admin dashboard
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: activeItems.map((item) => ({
            productId: item.product.id,
            reference: item.product.reference,
            name: item.product.name,
            quantity: item.quantity,
            unitPriceAr: item.product.sellingPriceAr || 0,
            totalPriceAr: (item.product.sellingPriceAr || 0) * item.quantity,
            image: item.product.image,
          })),
          totalAmountAr: orderTotal,
        }),
      }).catch((err) => console.error('Error saving order:', err));
    } catch (e) {
      console.error('Order tracking error:', e);
    }

    // Open WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
    onOrderSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#D71920] flex items-center justify-center font-bold">
              DS
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950">
                {step === 'form' ? 'Validation de votre Commande' : 'Récapitulatif Avant Envoi WhatsApp'}
              </h3>
              <span className="text-xs text-zinc-500 font-medium">
                Transmission directe sur WhatsApp (+261 33 75 565 84)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleProceedToReview} className="space-y-5">
              {/* Items Summary Strip */}
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 block">
                  Produits commandés ({activeItems.length})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {activeItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-zinc-200 last:border-none">
                      <div className="min-w-0 pr-3">
                        <span className="font-mono text-[#D71920] font-black mr-2">
                          {item.product.reference}
                        </span>
                        <span className="text-zinc-800 truncate">{item.product.name}</span>
                        <span className="text-zinc-500 ml-1">× {item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-900 shrink-0">
                        {item.product.sellingPriceAr
                          ? formatAr(item.product.sellingPriceAr * item.quantity)
                          : 'Sur devis'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-zinc-200 flex justify-between items-baseline font-bold text-sm text-zinc-900">
                  <span>Total équipement estimé :</span>
                  <span className="font-mono text-[#D71920] text-base font-black">{formatAr(orderTotal)}</span>
                </div>
              </div>

              {/* Error Callout */}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>Nom et prénom ou raison sociale *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Rakoto / Société ABC"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>Numéro de téléphone joignable (WhatsApp recommandé) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 033 75 565 84 ou 034 12 345 67"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>Adresse ou quartier de livraison / Ville *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ivandry, Antananarivo / Toamasina..."
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Instructions complémentaires ou questions (facultatif)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Besoin d'une installation sur place, devis avec facture..."
                    value={customer.note}
                    onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 rounded-lg px-3.5 py-2.5 border border-zinc-200 focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#D71920] hover:bg-[#b8141a] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md transition-all"
                >
                  Vérifier le récapitulatif de la commande
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Review exact message preview before sending */
            <div className="space-y-5">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                  Aperçu du message transmis à D SECURE :
                </h4>

                <div className="bg-white p-4 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-800 whitespace-pre-wrap leading-relaxed">
                  {`NOUVELLE COMMANDE – D SECURE

Bonjour D SECURE,

Je souhaite passer la commande suivante :

${activeItems
  .map(
    (item, idx) =>
      `Produit ${activeItems.length > 1 ? `#${idx + 1}` : ''}: ${item.product.name}\nRéférence: ${item.product.reference}\nQuantité: ${item.quantity}\nPrix unitaire: ${item.product.formattedPrice}\nTotal: ${
        item.product.sellingPriceAr
          ? formatAr(item.product.sellingPriceAr * item.quantity)
          : 'Sur devis'
      }`
  )
  .join('\n\n')}

Nom du client: ${customer.fullName}
Téléphone: ${customer.phone}
Adresse de livraison: ${customer.address}${
                    customer.note ? `\nNote: ${customer.note}` : ''
                  }

TOTAL DE LA COMMANDE: ${formatAr(orderTotal)}

Merci de confirmer ma commande.`}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="py-3 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modifier</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex-1 py-3.5 px-4 bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 fill-white" />
                  <span>Envoyer ma commande sur WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
