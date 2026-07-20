import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

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
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-800 text-cream-50">
            <Leaf size={18} />
          </span>
          <span className="font-display text-xl text-sage-900">Herb &amp; Root</span>
        </Link>
        <h1 className="font-display text-3xl text-sage-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-ink-600">{subtitle}</p>}
        <div className="mt-8 max-w-sm">{children}</div>
      </div>

      <div className="relative hidden overflow-hidden bg-sage-800 lg:block">
        <div className="absolute inset-0 bg-botanical opacity-40" />
        <div className="flex h-full flex-col items-center justify-center gap-6 p-16 text-center text-cream-50">
          <span className="text-6xl">🌿</span>
          <p className="font-display text-2xl leading-snug">
            "Every remedy on our shelf started as a seed we could name."
          </p>
          <p className="text-sm text-cream-100/70">— The Herb &amp; Root growers</p>
        </div>
      </div>
    </div>
  );
}
