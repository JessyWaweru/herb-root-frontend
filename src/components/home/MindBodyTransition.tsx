import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Brain, HeartPulse, Leaf } from 'lucide-react';

const STAGES = [
  {
    Icon: Leaf,
    color: 'text-sage-600',
    ring: 'bg-sage-100',
    glow: 'rgba(107, 142, 90, 0.45)',
    eyebrow: 'The whole plant',
    line: 'We use the leaf, root, and flower — not an isolated extract.',
  },
  {
    Icon: Brain,
    color: 'text-gold-600',
    ring: 'bg-gold-300/40',
    glow: 'rgba(201, 161, 90, 0.45)',
    eyebrow: 'Traditionally, for the mind',
    line: 'Herbs long used to ease stress and quiet a restless head.',
  },
  {
    Icon: HeartPulse,
    color: 'text-rose-600',
    ring: 'bg-rose-300/40',
    glow: 'rgba(201, 123, 95, 0.45)',
    eyebrow: 'And for the body',
    line: 'Then carried through, to support how the body feels day to day.',
  },
];

const FLOATERS = [
  { icon: '🌿', className: '-left-2 top-[12%] text-4xl sm:-left-4 sm:top-[15%] sm:text-6xl', duration: 9 },
  { icon: '🍃', className: 'right-0 top-[65%] text-3xl sm:text-5xl', duration: 7 },
  {
    icon: '🌸',
    className: 'left-[8%] bottom-[6%] text-3xl sm:bottom-[8%] sm:text-5xl',
    duration: 8,
  },
];

export function MindBodyTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 38, mass: 0.6 });

  const boundaries = [0, 0.32, 0.36, 0.64, 0.68, 1];

  const opacities = [
    useTransform(progress, [boundaries[0], boundaries[1], boundaries[2]], [1, 1, 0]),
    useTransform(progress, [boundaries[1], boundaries[2], boundaries[3], boundaries[4]], [0, 1, 1, 0]),
    useTransform(progress, [boundaries[3], boundaries[4], boundaries[5]], [0, 1, 1]),
  ];
  // rotateY drives the flip; each icon turns face-on -> edge-on -> away as it hands off to the next.
  // The rotate/scale ranges must line up with each icon's own opacity window (not the full 0-0.36 span),
  // otherwise backfaceVisibility:hidden flips the icon invisible before its fade-out has even begun.
  const rotationsY = [
    useTransform(progress, [boundaries[0], boundaries[1], boundaries[2]], [0, 0, -110]),
    useTransform(progress, [boundaries[1], boundaries[2], boundaries[3], boundaries[4]], [110, 0, 0, -110]),
    useTransform(progress, [boundaries[3], boundaries[4]], [110, 0]),
  ];
  const scales = [
    useTransform(progress, [boundaries[0], boundaries[1], boundaries[2]], [1, 1, 0.4]),
    useTransform(progress, [boundaries[1], boundaries[2], boundaries[3], boundaries[4]], [0.4, 1, 1, 0.4]),
    useTransform(progress, [boundaries[3], boundaries[4]], [0.4, 1]),
  ];

  const glow = useTransform(
    progress,
    [boundaries[0], boundaries[2], boundaries[3], boundaries[5]],
    [STAGES[0].glow, STAGES[1].glow, STAGES[1].glow, STAGES[2].glow],
  );
  const glowShadow = useTransform(glow, (g) => `0 0 70px 12px ${g}`);

  // captions get their own (narrower, non-overlapping) fade windows so two headlines are never
  // simultaneously legible mid-scroll the way the icon crossfade is allowed to be
  const captionOpacities = [
    useTransform(progress, [0, 0.3, 0.33], [1, 1, 0]),
    useTransform(progress, [0.3, 0.33, 0.6, 0.63], [0, 1, 1, 0]),
    useTransform(progress, [0.6, 0.63, 1], [0, 1, 1]),
  ];
  const captionY = [
    useTransform(captionOpacities[0], [0, 1], [8, 0]),
    useTransform(captionOpacities[1], [0, 1], [8, 0]),
    useTransform(captionOpacities[2], [0, 1], [8, 0]),
  ];
  const captionBlur = [
    useTransform(captionOpacities[0], (o) => `blur(${(1 - o) * 6}px)`),
    useTransform(captionOpacities[1], (o) => `blur(${(1 - o) * 6}px)`),
    useTransform(captionOpacities[2], (o) => `blur(${(1 - o) * 6}px)`),
  ];

  const dotScales = [
    useTransform(progress, [boundaries[0], boundaries[1]], [1, 0.5]),
    useTransform(progress, [boundaries[1], boundaries[2], boundaries[3], boundaries[4]], [0.5, 1, 1, 0.5]),
    useTransform(progress, [boundaries[3], boundaries[4]], [0.5, 1]),
  ];

  if (prefersReducedMotion) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {STAGES.map(({ Icon, color, ring, eyebrow, line }) => (
            <div key={eyebrow} className="flex flex-col items-center gap-3 text-center">
              <span className={`flex h-16 w-16 items-center justify-center rounded-full ${ring} ${color}`}>
                <Icon size={28} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">{eyebrow}</p>
              <p className="max-w-[16rem] text-sm text-ink-600">{line}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[200dvh] sm:h-[260dvh]">
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-botanical px-4 text-center">
        {FLOATERS.map(({ icon, className, duration }) => (
          <motion.div
            key={icon}
            className={`pointer-events-none absolute opacity-10 ${className}`}
            animate={{ y: [0, -16, 0], rotate: [-3, 3, -3] }}
            transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
          >
            {icon}
          </motion.div>
        ))}

        <span className="mb-6 text-xs font-semibold uppercase tracking-wide text-sage-600 sm:mb-10">
          One herb, taken whole
        </span>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ perspective: 900 }}
          className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32"
        >
          <motion.div
            style={{ boxShadow: glowShadow }}
            className="absolute h-24 w-24 rounded-full sm:h-32 sm:w-32"
          />
          {STAGES.map(({ Icon, color, ring }, i) => (
            <motion.span
              key={i}
              style={{
                opacity: opacities[i],
                rotateY: rotationsY[i],
                scale: scales[i],
                backfaceVisibility: 'hidden',
              }}
              className={`absolute flex h-20 w-20 items-center justify-center rounded-full sm:h-28 sm:w-28 ${ring} ${color}`}
            >
              <Icon size={34} className="sm:hidden" />
              <Icon size={44} className="hidden sm:block" />
            </motion.span>
          ))}
        </motion.div>

        <div className="relative mt-6 flex w-full items-center justify-center gap-2 sm:mt-8">
          {STAGES.map((_, i) => (
            <motion.span
              key={i}
              style={{ scale: dotScales[i] }}
              className="h-1.5 w-1.5 rounded-full bg-sage-500"
            />
          ))}
        </div>

        <div className="relative mt-5 h-24 w-full max-w-[19rem] sm:mt-6 sm:h-20 sm:max-w-sm">
          {STAGES.map(({ eyebrow, line }, i) => (
            <motion.div
              key={i}
              style={{ opacity: captionOpacities[i], y: captionY[i], filter: captionBlur[i] }}
              className="absolute inset-x-0 top-0"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-sage-600">{eyebrow}</p>
              <p className="mx-auto mt-2 max-w-xs text-balance text-sm text-ink-600">{line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
