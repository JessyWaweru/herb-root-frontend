import { useRef, useState, type ComponentType } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface Palette {
  stroke: string;
  fill: string;
  accent: string;
}

interface IllustrationProps extends Palette {
  active: boolean;
}

const draw = (active: boolean, delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
  transition: { pathLength: { duration: 1.1, delay, ease: 'easeInOut' as const }, opacity: { duration: 0.2, delay } },
});

const pop = (active: boolean, delay = 0) => ({
  initial: { scale: 0, opacity: 0 },
  animate: active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
  transition: { type: 'spring' as const, stiffness: 260, damping: 16, delay },
});

function WholePlant({ stroke, fill, accent, active }: IllustrationProps) {
  const petals = [0, 72, 144, 216, 288].map((deg) => {
    const r = (deg * Math.PI) / 180;
    return { cx: 80 + 8.5 * Math.sin(r), cy: 36 - 8.5 * Math.cos(r) };
  });
  return (
    <svg viewBox="0 0 160 160" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <motion.path d="M28 100H132" stroke={stroke} strokeWidth="2" strokeDasharray="2 6" {...draw(active)} />
      <g stroke={stroke} strokeWidth="2.5">
        <motion.path d="M80 100C80 112 74 121 64 129" {...draw(active, 0.2)} />
        <motion.path d="M80 100C82 113 90 122 100 130" {...draw(active, 0.25)} />
        <motion.path d="M80 103C78 116 80 127 80 138" {...draw(active, 0.3)} />
        <motion.path d="M70 118L60 116M92 119L102 114M80 126L72 132" {...draw(active, 0.6)} />
      </g>
      <motion.path d="M80 100C80 80 78 60 80 42" stroke={stroke} strokeWidth="3" {...draw(active, 0.35)} />
      <motion.path
        d="M80 78C64 77 52 66 49 52C64 52 76 62 80 74Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.5"
        {...pop(active, 0.75)}
        style={{ originX: '80px', originY: '76px' }}
      />
      <motion.path
        d="M80 64C94 61 106 50 111 37C96 37 84 47 80 60Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.5"
        {...pop(active, 0.85)}
        style={{ originX: '80px', originY: '62px' }}
      />
      <motion.g {...pop(active, 1)} style={{ originX: '80px', originY: '36px' }}>
        {petals.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="6.5" fill={fill} stroke={stroke} strokeWidth="2" />
        ))}
        <circle cx="80" cy="36" r="5" fill={accent} />
      </motion.g>
    </svg>
  );
}

function CalmMind({ stroke, fill, accent, active }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 160" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <motion.path
        d="M60 136V114C44 107 36 91 38 72C40 46 61 28 88 28C113 28 130 47 128 70C128 78 132 84 136 90C138 94 134 97 130 97V107C130 115 124 119 116 119H104V136"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        {...draw(active)}
        transition={{ pathLength: { duration: 1.4, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
      />
      <motion.path d="M84 102C84 84 86 68 93 54" stroke={stroke} strokeWidth="2.5" {...draw(active, 0.7)} />
      <motion.path
        d="M86 84C75 82 68 74 68 64C79 66 86 73 86 82Z"
        fill={accent}
        stroke={stroke}
        strokeWidth="2"
        {...pop(active, 1.1)}
        style={{ originX: '86px', originY: '83px' }}
      />
      <motion.path
        d="M89 68C99 64 105 55 105 46C96 48 90 55 89 64Z"
        fill={accent}
        stroke={stroke}
        strokeWidth="2"
        {...pop(active, 1.2)}
        style={{ originX: '89px', originY: '66px' }}
      />
      <g stroke={stroke} strokeWidth="2">
        <motion.path d="M138 40C142 36 146 36 150 40" {...draw(active, 1.3)} />
        <motion.path d="M134 30C140 24 148 24 154 30" {...draw(active, 1.4)} />
      </g>
      <motion.circle cx="30" cy="40" r="3" fill={accent} {...pop(active, 1.5)} />
      <motion.circle cx="22" cy="58" r="2" fill={accent} {...pop(active, 1.6)} />
    </svg>
  );
}

function CaredBody({ stroke, fill, accent, active }: IllustrationProps) {
  return (
    <svg viewBox="0 0 160 160" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <motion.path
        d="M80 134C42 110 30 86 34 66C38 47 58 40 72 50C76 53 78 56 80 60C82 56 84 53 88 50C102 40 122 47 126 66C130 86 118 110 80 134Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
        {...draw(active)}
        transition={{ pathLength: { duration: 1.3, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
      />
      <motion.path
        d="M14 92H50L58 76L68 110L78 82L86 96H146"
        stroke={stroke}
        strokeWidth="3"
        {...draw(active, 0.6)}
      />
      <motion.path d="M80 60C80 48 84 38 94 30" stroke={stroke} strokeWidth="2.5" {...draw(active, 1)} />
      <motion.path
        d="M89 40C89 28 99 19 112 19C112 32 102 40 89 40Z"
        fill={accent}
        stroke={stroke}
        strokeWidth="2"
        {...pop(active, 1.3)}
        style={{ originX: '89px', originY: '40px' }}
      />
    </svg>
  );
}

interface Stage {
  Illustration: ComponentType<IllustrationProps>;
  palette: Palette;
  tint: string;
  eyebrow: string;
  title: string;
  line: string;
}

const STAGES: Stage[] = [
  {
    Illustration: WholePlant,
    palette: { stroke: '#45603a', fill: '#e1ebd7', accent: '#e8b751' },
    tint: 'rgba(107, 142, 90, 0.22)',
    eyebrow: 'The whole plant',
    title: 'Root, leaf & flower.',
    line: 'We use every part that works — never an isolated extract.',
  },
  {
    Illustration: CalmMind,
    palette: { stroke: '#8a6a2f', fill: '#fbf3dd', accent: '#e7c873' },
    tint: 'rgba(201, 161, 90, 0.24)',
    eyebrow: 'For the mind',
    title: 'Quiet the noise.',
    line: 'Herbs long used to ease stress and settle a restless head.',
  },
  {
    Illustration: CaredBody,
    palette: { stroke: '#a85f45', fill: '#f8e3dc', accent: '#8aa876' },
    tint: 'rgba(201, 123, 95, 0.22)',
    eyebrow: 'And the body',
    title: 'Feel it, day to day.',
    line: 'Carried through to support how your body feels, every day.',
  },
];

function Slide({
  stage,
  index,
  position,
  active,
  reduced,
}: {
  stage: Stage;
  index: number;
  position: MotionValue<number>;
  active: boolean;
  reduced: boolean;
}) {
  // offset: -1 (slide is to the right) .. 0 (centred) .. 1 (scrolled past to the left)
  const offset = useTransform(position, (p) => p - index);
  const art = reduced ? [0, 0, 0] : [140, 0, -140];
  const artX = useTransform(offset, [-1, 0, 1], art);
  const artRotate = useTransform(offset, [-1, 0, 1], reduced ? [0, 0, 0] : [18, 0, -18]);
  const artScale = useTransform(offset, [-1, 0, 1], reduced ? [1, 1, 1] : [0.7, 1, 0.7]);
  const textX = useTransform(offset, [-1, 0, 1], reduced ? [0, 0, 0] : [-60, 0, 60]);
  const fade = useTransform(offset, [-0.8, 0, 0.8], [0, 1, 0]);
  const { Illustration, palette } = stage;

  return (
    <div
      className="flex w-full shrink-0 snap-center items-center justify-center px-6 sm:px-12"
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${STAGES.length}: ${stage.eyebrow}`}
    >
      <div className="grid w-full max-w-5xl items-center gap-8 md:grid-cols-2 md:gap-16">
        <motion.div
          style={{ x: artX, rotate: artRotate, scale: artScale, opacity: fade }}
          className="relative mx-auto aspect-square w-56 sm:w-72 md:w-80"
        >
          <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${palette.fill} 0%, transparent 70%)` }} />
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0"
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <circle cx="100" cy="100" r="94" fill="none" stroke={palette.stroke} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 7" />
            <circle cx="100" cy="6" r="3.5" fill={palette.accent} />
          </motion.svg>
          <div className="absolute inset-[14%] rounded-full bg-cream-50/70 shadow-soft backdrop-blur-sm" />
          <div className="absolute inset-[18%]">
            <Illustration {...palette} active={active || reduced} />
          </div>
        </motion.div>

        <motion.div style={{ x: textX, opacity: fade }} className="text-center md:text-left">
          <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] md:justify-start" style={{ color: palette.stroke }}>
            <span className="font-display text-2xl tracking-normal">0{index + 1}</span>
            <span className="h-px w-8" style={{ background: palette.stroke }} />
            {stage.eyebrow}
          </p>
          <h3 className="mt-4 font-display text-4xl leading-tight text-sage-900 sm:text-5xl">{stage.title}</h3>
          <p className="mx-auto mt-4 max-w-sm text-balance text-ink-600 md:mx-0">{stage.line}</p>
        </motion.div>
      </div>
    </div>
  );
}

export function MindBodyTransition() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = Boolean(useReducedMotion());
  const [active, setActive] = useState(0);
  const { scrollXProgress } = useScroll({ container: trackRef });
  const smooth = useSpring(scrollXProgress, { stiffness: 220, damping: 32, mass: 0.5 });
  const position = useTransform(smooth, (p) => p * (STAGES.length - 1));

  useMotionValueEvent(scrollXProgress, 'change', (p) => {
    setActive(Math.round(p * (STAGES.length - 1)));
  });

  const tint = useTransform(
    smooth,
    [0, 0.5, 1],
    STAGES.map((s) => s.tint),
  );
  const backdrop = useTransform(tint, (t) => `radial-gradient(60% 70% at 50% 50%, ${t}, transparent 75%)`);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(STAGES.length - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: reduced ? 'auto' : 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <section className="relative overflow-hidden bg-botanical py-16 sm:py-24" aria-roledescription="carousel" aria-label="One herb, taken whole">
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: backdrop }} />

      <div className="relative mb-6 text-center sm:mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">One herb, taken whole</span>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="no-scrollbar relative flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain focus:outline-none"
      >
        {STAGES.map((stage, i) => (
          <Slide key={stage.eyebrow} stage={stage} index={i} position={position} active={active === i} reduced={reduced} />
        ))}
      </div>

      <div className="relative mx-auto mt-10 flex max-w-5xl items-center justify-between gap-6 px-6 sm:px-12">
        <div className="flex flex-1 gap-2">
          {STAGES.map((stage, i) => (
            <ProgressSegment
              key={stage.eyebrow}
              index={i}
              label={stage.eyebrow}
              color={stage.palette.stroke}
              position={position}
              current={active === i}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-2 hidden text-xs text-ink-600 sm:inline">Swipe or use the arrows</span>
          <NavButton label="Previous" disabled={active === 0} onClick={() => goTo(active - 1)}>
            <ArrowLeft size={18} />
          </NavButton>
          <NavButton label="Next" disabled={active === STAGES.length - 1} onClick={() => goTo(active + 1)}>
            <ArrowRight size={18} />
          </NavButton>
        </div>
      </div>
    </section>
  );
}

function ProgressSegment({
  index,
  label,
  color,
  position,
  current,
  onClick,
}: {
  index: number;
  label: string;
  color: string;
  position: MotionValue<number>;
  current: boolean;
  onClick: () => void;
}) {
  const fill = useTransform(position, [index - 1, index], [0, 1]);
  return (
    <button onClick={onClick} aria-label={`Go to ${label}`} aria-current={current} className="relative h-8 flex-1">
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-sage-200/60">
        <motion.span className="absolute inset-0 origin-left rounded-full" style={{ background: color, scaleX: fill }} />
      </span>
    </button>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={clsx(
        'flex h-11 w-11 items-center justify-center rounded-full border transition',
        disabled
          ? 'cursor-not-allowed border-cream-300 text-ink-600/30'
          : 'border-sage-300 bg-cream-50 text-sage-800 shadow-soft hover:-translate-y-0.5 hover:bg-sage-800 hover:text-cream-50',
      )}
    >
      {children}
    </button>
  );
}
