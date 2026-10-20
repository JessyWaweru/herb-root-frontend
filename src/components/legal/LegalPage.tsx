import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LEGAL } from '../../lib/legal';
import { Breadcrumbs } from '../seo/Breadcrumbs';

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/cookies', label: 'Cookie Policy' },
  { to: '/refunds', label: 'Refund Policy' },
];

/** Shared layout for the legal pages: readable line length, last-updated date, links between them. */
export function LegalPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  const path = LEGAL_LINKS.find((link) => link.label === title)?.to ?? '/';

  return (
    <article className="legal mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: title, to: path }]} />
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">Last updated {LEGAL.lastUpdated}</p>
      <h1 className="mt-2 font-display text-3xl text-sage-900 sm:text-4xl">{title}</h1>
      <div className="mt-4 text-ink-700">{intro}</div>
      <div className="mt-10">{children}</div>
      <nav aria-label="Other policies" className="mt-14 border-t border-cream-300 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {LEGAL_LINKS.filter((link) => link.label !== title).map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 first:mt-0">
      <h2 className="font-display text-xl text-sage-900">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}

export function ContactLine() {
  return (
    <>
      email <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> or call <a href={`tel:${LEGAL.phone}`}>{LEGAL.phone}</a>
    </>
  );
}
