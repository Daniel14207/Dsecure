import { CartItem, OrderCustomerInfo, Product } from '../types/product';

const WHATSAPP_NUMBER = '261337556584';

/**
 * Formats a numeric price into Malagasy Ariary (Ar) string
 */
export const formatAr = (price: number | null | undefined): string => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Prix sur demande';
  }
  return new Intl.NumberFormat('fr-FR').format(price) + ' Ar';
};

/**
 * Builds the WhatsApp order URL from a full cart
 */
export const generateCartOrderWhatsAppUrl = (
  items: CartItem[],
  customer: OrderCustomerInfo
): string => {
  const total = items.reduce((sum, item) => {
    return sum + (item.product.sellingPriceAr || 0) * item.quantity;
  }, 0);

  let message = `NOUVELLE COMMANDE – D SECURE\n\n`;
  message += `Bonjour D SECURE,\n\n`;
  message += `Je souhaite passer la commande suivante :\n\n`;

  items.forEach((item, index) => {
    const unitPrice = item.product.sellingPriceAr
      ? formatAr(item.product.sellingPriceAr)
      : 'Prix sur demande';
    const lineTotal = item.product.sellingPriceAr
      ? formatAr(item.product.sellingPriceAr * item.quantity)
      : 'Prix sur demande';

    message += `Produit ${items.length > 1 ? `#${index + 1}` : ''}: ${item.product.name}\n`;
    message += `Référence: ${item.product.reference}\n`;
    message += `Quantité: ${item.quantity}\n`;
    message += `Prix unitaire: ${unitPrice}\n`;
    message += `Total: ${lineTotal}\n\n`;
  });

  message += `Nom du client: ${customer.fullName}\n`;
  message += `Téléphone: ${customer.phone}\n`;
  message += `Adresse de livraison: ${customer.address}\n`;
  if (customer.note && customer.note.trim()) {
    message += `Note / Instruction: ${customer.note.trim()}\n`;
  }
  message += `\nTOTAL DE LA COMMANDE: ${formatAr(total)}\n\n`;
  message += `Merci de confirmer ma commande.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Builds direct WhatsApp URL for a single product order
 */
export const generateSingleProductWhatsAppUrl = (
  product: Product,
  quantity: number = 1,
  customer?: OrderCustomerInfo
): string => {
  const unitPrice = product.sellingPriceAr
    ? formatAr(product.sellingPriceAr)
    : 'Prix sur demande';
  const total = product.sellingPriceAr
    ? formatAr(product.sellingPriceAr * quantity)
    : 'Prix sur demande';

  let message = `NOUVELLE COMMANDE – D SECURE\n\n`;
  message += `Bonjour D SECURE,\n\n`;
  message += `Je souhaite passer la commande suivante :\n\n`;
  message += `Produit: ${product.name}\n`;
  message += `Référence: ${product.reference}\n`;
  message += `Quantité: ${quantity}\n`;
  message += `Prix unitaire: ${unitPrice}\n`;
  message += `Total: ${total}\n\n`;

  if (customer) {
    message += `Nom du client: ${customer.fullName}\n`;
    message += `Téléphone: ${customer.phone}\n`;
    message += `Adresse de livraison: ${customer.address}\n`;
    if (customer.note && customer.note.trim()) {
      message += `Note: ${customer.note.trim()}\n`;
    }
  } else {
    message += `Nom du client: \nTéléphone: \nAdresse de livraison: \n`;
  }

  message += `\nTOTAL DE LA COMMANDE: ${total}\n\n`;
  message += `Merci de confirmer ma commande.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Builds quotation / service request URL
 */
export const generateServiceQuoteWhatsAppUrl = (
  serviceName: string,
  customerName: string,
  customerPhone: string,
  details: string
): string => {
  let message = `DEMANDE DE DEVIS & ÉTUDE – D SECURE\n\n`;
  message += `Bonjour D SECURE,\n\n`;
  message += `Je souhaite obtenir un devis pour le service suivant :\n`;
  message += `Service: ${serviceName}\n\n`;
  message += `Nom du client: ${customerName}\n`;
  message += `Téléphone: ${customerPhone}\n`;
  message += `Détails du besoin: ${details}\n\n`;
  message += `Merci de me recontacter pour une étude technique.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * General direct WhatsApp link
 */
export const getDirectWhatsAppUrl = (customText?: string): string => {
  if (!customText) {
    return `https://wa.me/${WHATSAPP_NUMBER}`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customText)}`;
};
