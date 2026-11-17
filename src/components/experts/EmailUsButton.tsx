import { Mail } from 'lucide-react';
import { buttonClasses } from '../ui/buttonStyles';

export const SUPPORT_EMAIL = 'hello@goherbal.health';

export function EmailUsButton({ subject, label = 'Email us', className }: { subject: string; label?: string; className?: string }) {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`} className={buttonClasses('outline', 'md', className)}>
      <Mail size={16} aria-hidden="true" /> {label}
    </a>
  );
}
