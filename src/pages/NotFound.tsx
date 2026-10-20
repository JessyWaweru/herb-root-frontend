import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';

const SUGGESTIONS = [
  { to: '/shop', label: 'All remedies' },
  { to: '/concerns', label: 'Shop by concern' },
  { to: '/experts', label: 'Talk to an expert' },
  { to: '/contact', label: 'Contact us' },
];

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <span className="text-6xl" aria-hidden="true">🥀</span>
      <h1 className="mt-4 font-display text-3xl text-sage-900">This page has wilted away</h1>
      <p className="mt-2 text-ink-600">
        We couldn't find what you were looking for. It may have moved, or the link may be mistyped.
      </p>
      <ButtonLink to="/" className="mt-6">Back to home</ButtonLink>
      <nav aria-label="Popular pages" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {SUGGESTIONS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="font-semibold text-sage-700 underline hover:text-sage-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
