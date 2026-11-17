import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Sprig } from '../components/art/Botanical';

const SUGGESTIONS = [
  { to: '/shop', label: 'All remedies' },
  { to: '/concerns', label: 'Shop by concern' },
  { to: '/experts', label: 'Talk to an expert' },
  { to: '/contact', label: 'Contact us' },
];

export function NotFound() {
  return (
    <div className="bg-botanical relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
        {/* A drooping sprig between the digits stands in for the zero. */}
        <p className="flex animate-rise items-center font-display text-[9rem] italic leading-none text-sage-200 sm:text-[13rem]" aria-hidden="true">
          4
          <Sprig className="-mx-2 h-[0.82em] origin-bottom rotate-[22deg] text-sage-500" leaves={6} />
          4
        </p>
        <h1 className="mt-6 text-balance font-display text-4xl leading-tight text-sage-900 sm:text-5xl">
          This page has <em className="accent-italic">wilted away</em>
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-600">
          We couldn't find what you were looking for. It may have moved, or the link may be mistyped.
        </p>
        <ButtonLink to="/" size="lg" className="mt-8">
          Back to home
          <ArrowRight size={17} aria-hidden="true" />
        </ButtonLink>
        <nav aria-label="Popular pages" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-block rounded-full border border-cream-300 bg-cream-50/80 px-4 py-2 text-sm font-semibold text-sage-800 transition-colors hover:border-sage-800 hover:bg-sage-800 hover:text-cream-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
