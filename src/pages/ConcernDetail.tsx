import { Link, useParams } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useProducts, useSymptoms } from '../hooks/useProducts';
import { PageSpinner, Spinner } from '../components/ui/Spinner';
import { ButtonLink } from '../components/ui/Button';
import { ItemNotFound } from '../components/ui/ItemNotFound';
import { ProductGrid } from '../components/product/ProductGrid';
import { Seo } from '../components/seo/Seo';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { CONCERN_SAFETY_NOTE, concernCrumbs, concernJsonLd, concernMeta, concernPath } from '../seo/site';

/** One concern's own page (e.g. /concerns/insomnia): what it is, the remedies tagged with it, other concerns. */
export function ConcernDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: concerns, isLoading } = useSymptoms();
  const concern = concerns?.find((c) => c.slug === slug);
  const { data: products, isLoading: productsLoading } = useProducts({ symptom: slug });

  if (isLoading) return <PageSpinner />;
  if (!concern) return <ItemNotFound title="We couldn't find that concern" linkTo="/concerns" linkLabel="See all concerns" />;

  const remedies = products?.results ?? [];
  const meta = concernMeta(concern, remedies.map((p) => p.name));
  const others = concerns?.filter((c) => c.slug !== concern.slug) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title={meta.title}
        description={meta.description}
        path={concernPath(concern.slug)}
        jsonLd={concernJsonLd(concern, remedies)}
      />
      <Breadcrumbs items={concernCrumbs(concern)} />

      <header className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">
          <span aria-hidden="true">{concern.icon || '🌿'}</span> Shop by concern
        </span>
        <h1 className="mt-1 font-display text-3xl text-sage-900 sm:text-4xl">{meta.heading}</h1>
        {concern.description && <p className="mt-3 text-lg text-ink-700">{concern.description}</p>}
        {concern.intro && <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-700">{concern.intro}</p>}
      </header>

      <section className="mt-12" aria-labelledby="remedies-heading">
        <h2 id="remedies-heading" className="mb-6 font-display text-2xl text-sage-900">
          Remedies for {concern.name.toLowerCase()}
          {products && <span className="ml-2 text-base text-ink-600">({products.count})</span>}
        </h2>
        {productsLoading ? <Spinner /> : <ProductGrid products={remedies} />}
        {products?.next && (
          <Link to={`/shop?symptom=${concern.slug}`} className="mt-6 inline-block text-sm font-semibold text-sage-700 underline">
            See all {products.count} remedies in the shop
          </Link>
        )}
      </section>

      <aside className="mt-12 flex flex-col gap-4 rounded-2xl border border-cream-300 bg-cream-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex max-w-2xl items-start gap-3 text-sm text-ink-700">
          <Stethoscope size={18} className="mt-0.5 shrink-0 text-sage-600" aria-hidden="true" />
          {CONCERN_SAFETY_NOTE}
        </p>
        <ButtonLink to="/experts" variant="outline" className="shrink-0">
          Talk to an expert
        </ButtonLink>
      </aside>

      {others.length > 0 && (
        <section className="mt-12" aria-labelledby="other-concerns-heading">
          <h2 id="other-concerns-heading" className="mb-4 font-display text-xl text-sage-900">
            Other concerns
          </h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.id}>
                <Link
                  to={concernPath(c.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-4 py-2 text-sm font-semibold text-sage-800 transition hover:bg-sage-200"
                >
                  <span aria-hidden="true">{c.icon}</span> {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
