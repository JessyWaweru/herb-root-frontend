import { Link, useParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowDown, ChevronDown, Leaf, Sparkles, Stethoscope, Tag } from 'lucide-react';
import { useIngredients, useProducts, useSymptoms } from '../hooks/useProducts';
import { PageSpinner } from '../components/ui/Spinner';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { Eyebrow, SectionHeading } from '../components/ui/SectionHeading';
import { Sprig } from '../components/art/Botanical';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { buttonClasses } from '../components/ui/buttonStyles';
import { ItemNotFound } from '../components/ui/ItemNotFound';
import { ProductGrid } from '../components/product/ProductGrid';
import { SmartSearchBar } from '../components/search/SmartSearchBar';
import { TrustStrip } from '../components/home/TrustStrip';
import { ConcernCard } from '../components/concerns/ConcernCard';
import { ConcernMedallion } from '../components/concerns/ConcernMedallion';
import { HerbCard } from '../components/concerns/HerbCard';
import { Seo } from '../components/seo/Seo';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { formatPrice } from '../lib/format';
import { herbsMentioned } from '../lib/herbs';
import { CONCERN_SAFETY_NOTE, concernCrumbs, concernJsonLd, concernMeta, concernPath } from '../seo/site';

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay },
});

/** One concern's own page (e.g. /concerns/insomnia): its guide, the herbs it mentions, its remedies, other concerns. */
export function ConcernDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: concerns, isLoading } = useSymptoms();
  const { data: ingredients } = useIngredients();
  const concern = concerns?.find((c) => c.slug === slug);
  const { data: products, isLoading: productsLoading } = useProducts({ symptom: slug });

  if (isLoading) return <PageSpinner />;
  if (!concern) return <ItemNotFound title="We couldn't find that concern" linkTo="/concerns" linkLabel="See all concerns" />;

  const remedies = products?.results ?? [];
  const meta = concernMeta(concern, remedies.map((p) => p.name));
  const others = concerns?.filter((c) => c.slug !== concern.slug) ?? [];
  const [lead, ...paragraphs] = concern.intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const herbs = herbsMentioned(`${concern.description} ${concern.intro}`, ingredients ?? []);
  const prices = remedies.map((p) => Number(p.price));
  const categories = [...new Map(remedies.filter((p) => p.category).map((p) => [p.category!.slug, p.category!])).values()];

  return (
    <div>
      <Seo
        title={meta.title}
        description={meta.description}
        path={concernPath(concern.slug)}
        jsonLd={concernJsonLd(concern, remedies)}
      />

      {/* Hero */}
      <section className="bg-botanical relative -mt-[4.5rem] overflow-hidden border-b border-cream-300 pt-[4.5rem]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Sprig className="absolute -left-10 bottom-[-4rem] h-80 -rotate-[16deg] text-sage-300/60" leaves={8} />
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-gold-300/25 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20">
          <Breadcrumbs items={concernCrumbs(concern)} className="mb-8" />
          <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:justify-between">
            <div className="max-w-2xl text-center lg:text-left">
              <m.div {...rise(0)}>
                <Eyebrow>
                  <Sparkles size={12} aria-hidden="true" /> Shop by concern
                </Eyebrow>
              </m.div>
              <m.h1
                {...rise(0.08)}
                className="mt-4 text-balance font-display text-4xl leading-[1.03] tracking-[-0.02em] text-sage-900 sm:text-5xl lg:text-6xl"
              >
                {meta.heading}
              </m.h1>
              {concern.description && (
                <m.p {...rise(0.16)} className="mt-5 text-lg leading-relaxed text-ink-700">
                  {concern.description}
                </m.p>
              )}
              <m.div {...rise(0.24)} className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                <Badge tone="cream">
                  {concern.product_count} {concern.product_count === 1 ? 'remedy' : 'remedies'}
                </Badge>
                {herbs.length > 0 && (
                  <Badge tone="cream">
                    {herbs.length} {herbs.length === 1 ? 'herb' : 'herbs'} explained
                  </Badge>
                )}
                <Badge tone="gold">Traditional use, plainly told</Badge>
              </m.div>
              <m.div {...rise(0.32)} className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <a href="#remedies" className={buttonClasses('primary', 'lg')}>
                  <ArrowDown size={17} aria-hidden="true" />
                  See the remedies
                </a>
                <SmartSearchBar
                  label="Describe how you feel"
                  placeholder="Or describe it in your own words…"
                  className="w-full max-w-xs"
                  inputClassName="h-13"
                />
              </m.div>
            </div>
            <ConcernMedallion icon={concern.icon || '🌿'} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Guide + at a glance */}
        {lead && (
          <section className="grid gap-10 py-16 lg:grid-cols-[1fr_340px] lg:gap-16 lg:py-24" aria-label="About this concern">
            <div>
              <m.p
                {...reveal()}
                className="relative border-l-2 border-gold-500 pl-6 font-display text-2xl leading-[1.3] text-sage-900 sm:pl-8 sm:text-[2rem]"
              >
                {lead}
              </m.p>
              <div className="mt-10 flex max-w-2xl flex-col gap-5 sm:pl-8">
                {paragraphs.map((text, i) => (
                  <m.p key={i} {...reveal(0.05 * i)} className="text-[17px] leading-[1.75] text-ink-700">
                    {text}
                  </m.p>
                ))}
              </div>
            </div>

            <m.aside
              {...reveal(0.1)}
              className="card h-fit p-7 lg:sticky lg:top-28"
            >
              <h2 className="font-display text-2xl text-sage-900">At a glance</h2>
              <dl className="mt-5 flex flex-col gap-5 text-sm">
                <div>
                  <dt className="eyebrow text-[10px] text-ink-600">Remedies</dt>
                  <dd className="mt-1 font-display text-5xl leading-none text-sage-900">{products?.count ?? concern.product_count}</dd>
                </div>
                {prices.length > 0 && (
                  <div>
                    <dt className="eyebrow text-[10px] text-ink-600">Price range</dt>
                    <dd className="mt-1.5 font-display text-xl text-sage-900">
                      {formatPrice(Math.min(...prices), remedies[0].currency)}
                      {Math.max(...prices) !== Math.min(...prices) && ` – ${formatPrice(Math.max(...prices), remedies[0].currency)}`}
                    </dd>
                  </div>
                )}
                {categories.length > 0 && (
                  <div>
                    <dt className="eyebrow text-[10px] text-ink-600">Comes as</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {categories.map((category) => (
                        <Link key={category.slug} to={`/shop?category=${category.slug}`}>
                          <Badge tone="sage" className="hover:bg-sage-800 hover:text-cream-50">
                            <Tag size={11} aria-hidden="true" /> {category.name}
                          </Badge>
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="mt-7 flex flex-col gap-2 border-t border-cream-200 pt-6">
                <a href="#remedies" className={buttonClasses()}>
                  Shop these remedies
                </a>
                <ButtonLink to="/experts" variant="ghost">
                  Ask an expert first
                </ButtonLink>
              </div>
            </m.aside>
          </section>
        )}

        {/* Herbs mentioned in the guide */}
        {herbs.length > 0 && (
          <section className="py-12 lg:py-16" aria-labelledby="herbs-heading">
            <m.div {...reveal()}>
              <SectionHeading
                id="herbs-heading"
                eyebrow={
                  <>
                    <Leaf size={13} aria-hidden="true" /> From the garden
                  </>
                }
                title={
                  <>
                    Herbs in <em>this guide</em>
                  </>
                }
              />
            </m.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {herbs.map((herb, i) => (
                <HerbCard key={herb.id} herb={herb} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Remedies */}
        <section id="remedies" className="scroll-mt-28 py-12 lg:py-16" aria-labelledby="remedies-heading">
          <m.div {...reveal()}>
            <SectionHeading
              id="remedies-heading"
              eyebrow={products ? `${products.count} ${products.count === 1 ? 'remedy' : 'remedies'}` : 'Remedies'}
              title={
                <>
                  Remedies for <em>{concern.name.toLowerCase()}</em>
                </>
              }
            />
          </m.div>
          {productsLoading ? <ProductGridSkeleton /> : <ProductGrid products={remedies} animated />}
          {products?.next && (
            <Link
              to={`/shop?symptom=${concern.slug}`}
              className="mt-8 inline-block text-sm font-semibold text-sage-700 underline underline-offset-2"
            >
              See all {products.count} remedies in the shop
            </Link>
          )}
        </section>

        {/* Common questions */}
        {concern.faqs.length > 0 && (
          <section className="grid gap-8 py-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:py-16" aria-labelledby="faq-heading">
            <m.div {...reveal()}>
              <SectionHeading
                id="faq-heading"
                eyebrow="Good to know"
                title={
                  <>
                    Common <em>questions</em>
                  </>
                }
                className="mb-0"
              />
            </m.div>
            <div className="flex flex-col border-t border-cream-300">
              {concern.faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-cream-300">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-xl leading-snug text-sage-900 transition-colors hover:text-sage-600 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sage-800/20 text-sage-800 transition duration-300 group-open:rotate-180 group-open:border-sage-800 group-open:bg-sage-800 group-open:text-cream-50">
                      <ChevronDown size={17} aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 leading-relaxed text-ink-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Safety */}
        <m.aside
          {...reveal()}
          className="bg-forest relative my-12 overflow-hidden rounded-[2.5rem] p-8 text-cream-50 sm:p-12"
        >
          <Sprig className="pointer-events-none absolute -right-6 -top-10 h-64 rotate-[28deg] text-sage-300/20" leaves={7} />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex max-w-2xl items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream-50/10 text-gold-400">
                <Stethoscope size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-3xl text-cream-50">Not sure it's right for you?</h2>
                <p className="mt-2 text-sm leading-relaxed text-cream-100/85">{CONCERN_SAFETY_NOTE}</p>
              </div>
            </div>
            <ButtonLink to="/experts" variant="secondary" size="lg" className="shrink-0">
              Talk to an expert
            </ButtonLink>
          </div>
        </m.aside>

        {/* Other concerns */}
        {others.length > 0 && (
          <section className="py-12 lg:py-16" aria-labelledby="other-concerns-heading">
            <m.div {...reveal()}>
              <SectionHeading
                id="other-concerns-heading"
                eyebrow="Keep exploring"
                title={
                  <>
                    Explore <em>other concerns</em>
                  </>
                }
              />
            </m.div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {others.map((c, i) => (
                <ConcernCard key={c.id} concern={c} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8">
        <TrustStrip />
      </div>
    </div>
  );
}
