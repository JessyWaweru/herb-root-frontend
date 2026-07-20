import { Leaf, MapPinned, ShieldCheck, Truck } from 'lucide-react';

const ITEMS = [
  { icon: Leaf, title: 'Grown, not synthesized', desc: 'Whole-herb ingredients, nothing artificial.' },
  { icon: MapPinned, title: 'Traceable to the garden', desc: 'See exactly which farm each herb comes from.' },
  { icon: ShieldCheck, title: 'Secure checkout', desc: 'Payments processed safely via Paystack.' },
  { icon: Truck, title: 'Delivered fresh', desc: 'Packed to order across Kenya.' },
];

export function TrustStrip() {
  return (
    <section className="border-y border-cream-300 bg-cream-50/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
              <Icon size={19} />
            </span>
            <div>
              <p className="text-sm font-semibold text-sage-900">{title}</p>
              <p className="text-xs text-ink-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
