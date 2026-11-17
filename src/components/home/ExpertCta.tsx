import { m } from 'framer-motion';
import { ArrowRight, Mail, Phone, Video } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { Eyebrow } from '../ui/SectionHeading';
import { Sprig } from '../art/Botanical';

const MODES = [
  { icon: Mail, label: 'Email' },
  { icon: Phone, label: 'Phone' },
  { icon: Video, label: 'Video' },
];

/** The last thing on the home page: an invitation to book a session for anyone still unsure. */
export function ExpertCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <m.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] border border-cream-300 bg-cream-50 px-6 py-14 text-center shadow-soft sm:px-12 sm:py-20"
      >
        <Sprig className="pointer-events-none absolute -left-8 top-6 h-72 -rotate-[20deg] text-sage-300/70" leaves={7} />
        <Sprig className="pointer-events-none absolute -right-8 bottom-0 h-72 rotate-[160deg] text-gold-400/60" leaves={7} />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <Eyebrow>Talk to an expert</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-4xl leading-[1.05] text-sage-900 sm:text-5xl">
            Not sure which remedy is <em className="accent-italic">right for you?</em>
          </h2>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-ink-600">
            Book a one-to-one session with one of our herbal coaches, or with a licensed medical specialist, by email,
            phone or video.
          </p>
          <ul className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Ways to talk">
            {MODES.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full bg-sage-50 px-4 py-2 text-xs font-semibold text-sage-800 ring-1 ring-sage-100">
                <Icon size={14} aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
          <ButtonLink to="/experts" size="lg" className="mt-9">
            Meet the experts
            <ArrowRight size={17} aria-hidden="true" />
          </ButtonLink>
        </div>
      </m.div>
    </section>
  );
}
