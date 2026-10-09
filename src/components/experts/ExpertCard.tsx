import { Link } from 'react-router-dom';
import { BadgeCheck, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatPrice } from '../../lib/format';
import type { Expert } from '../../types';

export function ExpertAvatar({ expert, size = 'md' }: { expert: Expert; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-28 w-28 text-3xl' : 'h-16 w-16 text-xl';
  if (expert.photo_url) {
    return <img src={expert.photo_url} alt="" className={`${box} shrink-0 rounded-full object-cover`} />;
  }
  const initials = expert.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <span className={`${box} flex shrink-0 items-center justify-center rounded-full bg-sage-100 font-display text-sage-800`}>
      {initials}
    </span>
  );
}

export function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <Link
      to={`/experts/${expert.slug}`}
      className="flex flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-5 transition hover:border-sage-300 hover:shadow-soft"
    >
      <div className="flex items-center gap-4">
        <ExpertAvatar expert={expert} />
        <div>
          <p className="font-display text-lg text-sage-900">{expert.name}</p>
          <p className="text-sm text-ink-600">{expert.title}</p>
          <Badge tone={expert.kind === 'medical_specialist' ? 'gold' : 'sage'} className="mt-1">
            {expert.kind_label}
          </Badge>
        </div>
      </div>
      {expert.specialties && <p className="text-sm text-ink-700">{expert.specialties}</p>}
      <div className="mt-auto flex items-center justify-between border-t border-cream-300 pt-3 text-sm">
        <span className="flex items-center gap-1.5 text-ink-600">
          <Clock size={14} /> {expert.session_minutes} min
          {expert.licence_number && (
            <span className="ml-2 flex items-center gap-1 text-sage-700">
              <BadgeCheck size={14} /> Licensed
            </span>
          )}
        </span>
        <span className="font-semibold text-sage-900">{Number(expert.fee) ? formatPrice(expert.fee, expert.currency) : 'Free'}</span>
      </div>
    </Link>
  );
}
