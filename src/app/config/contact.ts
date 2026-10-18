// Ramp Recover contact details: the one place to change them. Used by the footer, the header,
// the floating contact buttons, the legal pages and the Smartsupp live chat.
export const CONTACT = {
  email: 'recover@getfinora.org',
  phone: '+1 (207) 250-6231',
  // International format, digits only: country code + number, no "+", spaces or dashes.
  whatsapp: '12072506231',
  whatsappMessage: 'Hi Ramp Recover, I need help with a scam case.',
  // Set NEXT_PUBLIC_SMARTSUPP_KEY in .env.local (and in the hosting provider's settings).
  // It's the `_smartsupp.key` value from Smartsupp → Settings → Chat box. Empty = no live chat on the site.
  smartsuppKey: process.env.NEXT_PUBLIC_SMARTSUPP_KEY ?? '',
};

export const emailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Scam recovery enquiry')}`;
export const phoneHref = `tel:${CONTACT.phone.replace(/[^\d+]/g, '')}`;
export const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`;
export const liveChatEnabled = CONTACT.smartsuppKey !== '';
