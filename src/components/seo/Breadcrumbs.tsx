import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import type { Crumb } from '../../seo/site';

/** "Home › Shop › Remedy" trail; the last item is the current page. Pair with breadcrumbJsonLd for search engines. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const trail = [{ label: 'Home', to: '/' }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={clsx('mb-6 text-xs font-medium text-ink-600', className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.to + crumb.label} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-sage-900">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link to={crumb.to} className="transition-colors hover:text-sage-800">
                    {crumb.label}
                  </Link>
                  <ChevronRight size={12} aria-hidden="true" className="text-cream-400" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
