import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';
import { Seal, Sprig } from '../art/Botanical';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="bg-botanical relative flex flex-col px-6 py-8 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 transition-colors hover:text-sage-800">
            <ArrowLeft size={14} aria-hidden="true" /> Back to the shop
          </Link>
        </div>
        <div className="my-auto w-full max-w-md animate-rise py-14">
          <h1 className="text-balance font-display text-4xl leading-[1.05] text-sage-900 sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 leading-relaxed text-ink-600">{subtitle}</p>}
          <div className="mt-9">{children}</div>
        </div>
      </div>

      <div className="bg-forest relative hidden overflow-hidden lg:block">
        <Sprig className="absolute -left-10 top-10 h-96 -rotate-12 text-sage-300/15" leaves={8} />
        <Sprig className="absolute -right-12 bottom-0 h-[30rem] rotate-[200deg] text-gold-400/10" leaves={7} />
        <div className="relative flex h-full flex-col items-center justify-center gap-10 p-16 text-center text-cream-50">
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-sage-400/20 blur-3xl" aria-hidden="true" />
            <div className="arch relative h-80 w-60 overflow-hidden bg-black shadow-lift ring-1 ring-cream-50/20">
              <img src="/images/auth/basil-leaf.webp" alt="" width={600} height={600} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-14 h-28 w-28">
              <Seal text="Grown in the Senses Garden · Kenya ·" className="h-full w-full text-gold-500 [--seal-ink:#0a3829] [--seal-leaf:#e8b751]" />
            </div>
          </div>
          <figure className="max-w-md">
            <blockquote className="text-balance font-display text-3xl italic leading-snug text-cream-50">
              “Every remedy on our shelf started as a seed we could name.”
            </blockquote>
            <figcaption className="eyebrow mt-5 text-sage-300">The GOherbal growers</figcaption>
          </figure>
        </div>
      </div>
    </main>
  );
}
