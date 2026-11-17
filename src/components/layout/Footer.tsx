import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeNewsletter } from '../../lib/core';
import { apiErrorMessage } from '../../lib/api';
import { LEGAL } from '../../lib/legal';
import { Logo } from './Logo';
import { Sprig } from '../art/Botanical';
import { DEVELOPER } from '../../seo/site';

const SHOP_LINKS = [
  { to: '/shop', label: 'All remedies' },
  { to: '/concerns', label: 'Shop by concern' },
  { to: '/shop?is_bestseller=true', label: 'Bestsellers' },
  { to: '/shop?is_featured=true', label: 'Featured' },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'Our story' },
  { to: '/experts', label: 'Talk to an expert' },
  { to: '/contact', label: 'Contact us' },
  { to: '/account/orders', label: 'Track an order' },
];

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/cookies', label: 'Cookies' },
  { to: '/refunds', label: 'Refunds' },
];

const footerLink = 'link-sweep text-cream-100/85 hover:text-gold-400';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { detail } = await subscribeNewsletter(email);
      toast.success(detail);
      setEmail('');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not subscribe right now.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-forest relative mt-28 overflow-hidden text-cream-100">
      <Sprig className="pointer-events-none absolute -right-10 -top-6 h-[26rem] rotate-[18deg] text-sage-300/15" leaves={8} />
      <Sprig className="pointer-events-none absolute -left-16 bottom-10 hidden h-80 -rotate-[24deg] text-gold-400/10 lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Garden letter */}
        <div className="grid items-end gap-10 border-b border-cream-50/10 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div>
            <span className="eyebrow inline-flex items-center gap-3 text-gold-400">
              <span className="h-px w-7 bg-current opacity-50" aria-hidden="true" />
              The garden letter
            </span>
            <h2 className="mt-4 max-w-xl text-balance font-display text-4xl leading-[1.05] text-cream-50 sm:text-5xl">
              Seasonal remedies &amp; growing notes, <em className="font-normal italic text-sage-300">monthly.</em>
            </h2>
          </div>
          <div>
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2 rounded-full border border-cream-50/15 bg-cream-50/5 p-1.5 pl-5 backdrop-blur transition-colors focus-within:border-gold-400/70"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full min-w-0 bg-transparent py-2 text-[15px] text-cream-50 placeholder:text-cream-100/70 focus:outline-none focus-visible:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-gold-500 px-5 text-sm font-semibold text-ink-900 shadow-gold transition hover:bg-gold-400 disabled:opacity-50"
              >
                Subscribe
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </form>
            <p className="mt-3 pl-5 text-xs text-cream-100/70">
              Unsubscribe anytime. See our{' '}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-gold-400">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo dark tagline tone="white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/75">
              Herbal remedies chosen by what you feel — grown with care, explained with honesty.
            </p>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div className="col-span-2 md:col-span-1">
            <h2 className="eyebrow text-cream-100/70">Say hello</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href={`mailto:${LEGAL.email}`} className="group inline-flex items-center gap-2.5 text-cream-100/85 hover:text-gold-400">
                  <Mail size={15} className="text-sage-300 group-hover:text-gold-400" aria-hidden="true" />
                  {LEGAL.email}
                </a>
              </li>
              <li>
                <a href={`tel:${LEGAL.phone}`} className="group inline-flex items-center gap-2.5 text-cream-100/85 hover:text-gold-400">
                  <Phone size={15} className="text-sage-300 group-hover:text-gold-400" aria-hidden="true" />
                  {LEGAL.phone}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ways to pay">
              {['M-Pesa', 'Card', 'Secured by Paystack'].map((label) => (
                <li key={label} className="rounded-full border border-cream-50/15 px-3 py-1 text-[11px] font-semibold text-cream-100/80">
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-cream-50/10 py-7 text-xs text-cream-100/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} GOherbal. All rights reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-gold-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>
            Designed &amp; built by{' '}
            <a href={DEVELOPER.url} target="_blank" rel="noopener" className="font-semibold text-cream-100 underline-offset-2 hover:text-gold-400 hover:underline">
              {DEVELOPER.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow text-cream-100/70">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className={footerLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
