import clsx from 'clsx';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../../lib/whatsapp';

export function WhatsAppButton({ message, label = 'Chat on WhatsApp', className }: { message: string; label?: string; className?: string }) {
  const href = whatsappLink(message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full border border-sage-400 px-5 py-2.5 text-sm font-semibold text-sage-800 transition hover:bg-sage-50',
        className,
      )}
    >
      <MessageCircle size={16} /> {label}
    </a>
  );
}
