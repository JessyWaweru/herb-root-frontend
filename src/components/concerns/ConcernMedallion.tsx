import { m } from 'framer-motion';

/** The concern's emoji inside slowly turning rings, with the gold dot from the GOherbal mark in orbit. Decorative. */
export function ConcernMedallion({ icon }: { icon: string }) {
  return (
    <div className="relative h-56 w-56 shrink-0 sm:h-72 sm:w-72" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-sage-300/30 blur-3xl" />
      <m.div
        className="absolute inset-0 rounded-full border-2 border-dashed border-sage-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <m.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500 shadow-soft" />
      </m.div>
      <m.div
        className="absolute inset-6 rounded-full border-[6px] border-sage-200"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.div
        className="absolute inset-12 flex items-center justify-center rounded-full bg-cream-50 shadow-lift"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 }}
      >
        <m.span
          className="text-6xl sm:text-7xl"
          animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </m.span>
      </m.div>
    </div>
  );
}
