import { Link } from 'react-router-dom';
import { BadgeCheck, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatPrice } from '../../lib/format';
import type { Expert } from '../../types';

export function ExpertAvatar({ expert, size = 'md' }: { expert: Expert; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-28 w-28 text-3xl' : 'h-16 w-16 text-xl';
  if (expert.photo_url) {
    return <img src={expert.photo_url} alt="" className={`${box} shrink-0 rounded-full object-cover ring-2 ring-cream-50 shadow-soft`} />;
  }
  const initials = expert.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <span className={`${box} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sage-600 to-sage-900 font-display text-cream-50 shadow-soft ring-2 ring-cream-50`}>
      {initials}
    </span>
  );
}

export function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <Link
      to={`/experts/${expert.slug}`}
      className="card group flex flex-col gap-4 p-6 transition duration-300 hover:-translate-y-1 hover:border-sage-300 hover:shadow-lift"
    >
      <div className="flex items-center gap-4">
        <ExpertAvatar expert={expert} />
        <div>
          <p className="font-display text-xl leading-tight text-sage-900 transition-colors group-hover:text-sage-600">{expert.name}</p>
          <p className="text-sm text-ink-600">{expert.title}</p>
          <Badge tone={expert.kind === 'medical_specialist' ? 'gold' : 'sage'} className="mt-1">
            {expert.kind_label}
          </Badge>
        </div>
      </div>
      {expert.specialties && <p className="text-sm leading-relaxed text-ink-700">{expert.specialties}</p>}
      <div className="mt-auto flex items-center justify-between border-t border-cream-200 pt-4 text-sm">
        <span className="flex items-center gap-1.5 text-ink-600">
          <Clock size={14} /> {expert.session_minutes} min
          {expert.licence_number && (
            <span className="ml-2 flex items-center gap-1 text-sage-700">
              <BadgeCheck size={14} /> Licensed
            </span>
          )}
        </span>
        <span className="font-display text-xl text-sage-900">{Number(expert.fee) ? formatPrice(expert.fee, expert.currency) : 'Free'}</span>
      </div>
    </Link>
  );
}
