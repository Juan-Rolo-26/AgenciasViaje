export const CONTACT_EMAIL = "topotoursviajes@gmail.com";
export const WHATSAPP_NUMBER = "5493518785667";

export const getWhatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
