// Business WhatsApp number in international format without "+", e.g. 254712345678.
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '') ?? '';

/** A click-to-chat link with a prefilled message, or null when no number is configured. */
export function whatsappLink(message: string) {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
