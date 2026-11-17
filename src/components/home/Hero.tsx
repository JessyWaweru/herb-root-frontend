import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import clsx from 'clsx';
import { useSmartSearchNavigate } from '../../hooks/useSmartSearch';
import { useSymptoms } from '../../hooks/useProducts';
import { GARDEN_PHOTOS, type GardenPhoto } from '../../lib/gardenPhotos';
import { concernPath } from '../../seo/site';
import { PhotoCredits } from '../art/PhotoCredits';
import { Seal, Sprig } from '../art/Botanical';

// Things a visitor might type, shown one after another in the empty search box.
const EXAMPLES = [
  "I can't sleep and my head hurts",
  'My stomach feels unsettled after meals',
  "I'm stressed and tired all the time",
  'My joints ache in the morning',
];

const photo = (name: string) => GARDEN_PHOTOS.find((p) => p.name.startsWith(name)) as GardenPhoto;
const LAVENDER = photo('Lavender');
const CHAMOMILE = photo('Chamomile');
const HIBISCUS = photo('Hibiscus');

/** Types each example out, pauses, clears it, and moves to the next. Still for visitors who ask for less motion. */
function useTypedExample(paused: boolean) {
  const reduced = useReducedMotion();
  const [text, setText] = useState(EXAMPLES[0]);

  useEffect(() => {
    if (reduced || paused) return;
    let example = 0;
    let length = EXAMPLES[0].length;
    let deleting = true;
    let timer: number;

    const tick = () => {
      const full = EXAMPLES[example];
      if (deleting) {
        length -= 1;
        if (length === 0) {
          deleting = false;
          example = (example + 1) % EXAMPLES.length;
        }
      } else {
        length += 1;
        if (length === EXAMPLES[example].length) deleting = true;
      }
      setText(EXAMPLES[example].slice(0, length));
      const atFullLine = deleting && length === full.length;
      timer = window.setTimeout(tick, atFullLine ? 2400 : deleting ? 22 : 48);
    };
    timer = window.setTimeout(tick, 2600);
    return () => window.clearTimeout(timer);
  }, [reduced, paused]);

  return text;
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const smartSearch = useSmartSearchNavigate();
  const { data: symptoms } = useSymptoms();
  const example = useTypedExample(focused || query.length > 0);

  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const drift = reduced ? [0, 0] : [0, -70];
  const slow = useTransform(scrollYProgress, [0, 1], drift);
  const fast = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -130]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    smartSearch(query);
  };

  return (
    <section ref={sectionRef} className="bg-botanical relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      <Sprig className="pointer-events-none absolute -left-14 bottom-[-3rem] h-[26rem] -rotate-[14deg] text-sage-300/50" leaves={8} />
      <div
        className="pointer-events-none absolute right-[-12rem] top-[-10rem] h-[40rem] w-[40rem] rounded-full border border-dashed border-sage-300/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-x-10 gap-y-14 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.12fr_1fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div>
          <m.span {...rise(0)} className="inline-flex items-center gap-2.5 rounded-full border border-sage-200 bg-cream-50/80 py-1.5 pl-2 pr-4 text-xs font-semibold text-sage-800 shadow-soft backdrop-blur">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-800" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            </span>
            Grown, dried, and blended with care
          </m.span>

          <m.h1
            {...rise(0.08)}
            className="display-sturdy mt-7 font-display text-[clamp(3rem,6.4vw,5.25rem)] leading-[0.97] tracking-[-0.025em] text-sage-900"
          >
            Remedies rooted <br className="hidden sm:block" />
            in <em className="accent-italic">nature.</em>
          </m.h1>

          <m.p {...rise(0.16)} className="mt-7 max-w-lg text-pretty text-lg leading-relaxed text-ink-700">
            Herbs traditionally used to ease what ails you, with full ingredients and origin on every label.
          </m.p>

          <m.form
            {...rise(0.24)}
            onSubmit={handleSubmit}
            role="search"
            aria-label="Describe how you feel"
            className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-full border border-cream-300 bg-cream-50 p-2 shadow-lift transition-[border-color,box-shadow] duration-200 focus-within:border-sage-600 focus-within:ring-4 focus-within:ring-sage-600/15"
          >
            <Search size={19} className="ml-3.5 shrink-0 text-sage-700" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={`Try “${example}”`}
              aria-label="Search remedies, or describe how you feel"
              className="w-full min-w-0 bg-transparent px-1 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-600 focus:outline-none focus-visible:outline-none"
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-sage-800 px-5 text-sm font-semibold text-cream-50 shadow-press transition hover:bg-sage-900 sm:px-6"
            >
              Find relief
              <ArrowRight size={16} aria-hidden="true" className="hidden sm:block" />
            </button>
          </m.form>

          {symptoms && symptoms.length > 0 && (
            <m.div {...rise(0.32)} className="mt-6 flex max-w-xl flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-semibold text-ink-600">Or start with</span>
              {symptoms.slice(0, 4).map((symptom) => (
                <Link
                  key={symptom.id}
                  to={concernPath(symptom.slug)}
                  className="rounded-full border border-cream-300 bg-cream-50/70 px-3.5 py-1.5 text-xs font-semibold text-sage-800 transition-colors hover:border-sage-800 hover:bg-sage-800 hover:text-cream-50"
                >
                  <span aria-hidden="true">{symptom.icon}</span> {symptom.name}
                </Link>
              ))}
            </m.div>
          )}
        </div>

        {/* The garden, in three windows. */}
        <div>
          <div className="relative mx-auto h-[24rem] max-w-md sm:h-[30rem] lg:h-[35rem] lg:max-w-none">
            <m.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-[7%] top-0 h-[88%] w-[60%]"
            >
              <m.figure style={{ y: slow }} className="arch relative h-full overflow-hidden shadow-lift ring-1 ring-sage-900/10">
                <img
                  src={LAVENDER.src}
                  alt={LAVENDER.alt}
                  fetchPriority="high"
                  className="h-full w-full scale-105 object-cover"
                  style={{ objectPosition: LAVENDER.focus }}
                />
                <PhotoLabel className="pl-[24%]">{LAVENDER.name}</PhotoLabel>
              </m.figure>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 50, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 h-[54%] w-[42%]"
            >
              <m.figure style={{ y: fast }} className="arch relative h-full overflow-hidden shadow-lift ring-[6px] ring-cream-100">
                <img src={CHAMOMILE.src} alt={CHAMOMILE.alt} className="h-full w-full object-cover" style={{ objectPosition: CHAMOMILE.focus }} />
                <PhotoLabel>{CHAMOMILE.name}</PhotoLabel>
              </m.figure>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-[3%] right-0 aspect-square w-[31%]"
            >
              <m.figure style={{ y: fast }} className="relative h-full overflow-hidden rounded-full shadow-lift ring-[6px] ring-cream-100">
                <img src={HIBISCUS.src} alt={HIBISCUS.alt} className="h-full w-full object-cover" style={{ objectPosition: '58% 45%' }} />
              </m.figure>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[14%] top-[6%] h-24 w-24 sm:h-28 sm:w-28"
            >
              <Seal text="Grown in the Senses Garden · Kenya ·" className="h-full w-full text-sage-800 drop-shadow-lg [--seal-leaf:#0e4d3a]" />
            </m.div>

            <span className="absolute right-[2%] top-[10%] h-4 w-4 rounded-full bg-gold-500 shadow-gold" aria-hidden="true" />
          </div>
          <PhotoCredits photos={[LAVENDER, CHAMOMILE, HIBISCUS]} className="mx-auto mt-5 max-w-md text-ink-600 lg:ml-auto lg:mr-0 lg:max-w-sm lg:text-right" />
        </div>
      </div>
    </section>
  );
}

function PhotoLabel({ children, className }: { children: string; className?: string }) {
  return (
    <figcaption
      className={clsx(
        'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-sage-950/70 to-transparent px-5 pb-4 pt-12 font-display text-sm italic tracking-wide text-cream-50',
        className,
      )}
    >
      {children}
    </figcaption>
  );
}
