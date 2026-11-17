import { Leaf, MapPinned, ShieldCheck, Truck } from 'lucide-react';

const ITEMS = [
  { icon: Leaf, title: 'Grown, not synthesized', desc: 'Whole-herb ingredients, nothing artificial.' },
  { icon: MapPinned, title: 'Traceable to our garden', desc: 'Every herb is grown in our own Senses Garden.' },
  { icon: ShieldCheck, title: 'Secure checkout', desc: 'Payments processed safely via Paystack.' },
  { icon: Truck, title: 'Delivered fresh', desc: 'Packed to order across Kenya.' },
];

export function TrustStrip() {
  return (
    <section aria-label="Our promises" className="border-y border-cream-300 bg-cream-300">
      {/* A one-pixel gap over the border colour draws the hairlines between the cells. */}
      <ul className="mx-auto grid max-w-[90rem] grid-cols-2 gap-px lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="group flex flex-col gap-4 bg-cream-50 px-5 py-8 transition-colors duration-300 hover:bg-sage-50 sm:px-8 sm:py-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sage-200 bg-cream-50 text-sage-700 transition-colors duration-300 group-hover:border-sage-800 group-hover:bg-sage-800 group-hover:text-gold-400">
              <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-xl leading-tight text-sage-900">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
