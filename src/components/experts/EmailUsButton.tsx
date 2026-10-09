import clsx from 'clsx';
import { Mail } from 'lucide-react';

export const SUPPORT_EMAIL = 'hello@goherbal.health';

export function EmailUsButton({ subject, label = 'Email us', className }: { subject: string; label?: string; className?: string }) {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full border border-sage-400 px-5 py-2.5 text-sm font-semibold text-sage-800 transition hover:bg-sage-50',
        className,
      )}
    >
      <Mail size={16} /> {label}
    </a>
  );
}
