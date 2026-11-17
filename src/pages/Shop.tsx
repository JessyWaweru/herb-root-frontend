import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useCategories, useProducts, useSmartSearch, useSymptoms } from '../hooks/useProducts';
import { FilterSidebar, type Filters } from '../components/product/FilterSidebar';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { PageHero } from '../components/layout/PageHero';
import { Button } from '../components/ui/Button';
import { Seo } from '../components/seo/Seo';
import { PAGES, breadcrumbJsonLd, concernPath, graph, type Crumb } from '../seo/site';

// Beside the filter panel there's room for three cards a row, not four.
const GRID_BESIDE_FILTERS = 'xl:grid-cols-3';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: '-average_rating', label: 'Top rated' },
  { value: 'name', label: 'Name: A-Z' },
];

export function Shop() {
  const [params] = useSearchParams();
  const q = params.get('q')?.trim();

  if (q) return <SmartResults query={q} />;

  return <StandardShop />;
}

/** Results for a free-text search — the backend detects concerns, tolerates typos and
 * ranks by relevance, falling back to bestsellers rather than an empty page. */
function SmartResults({ query }: { query: string }) {
  const { data, isLoading } = useSmartSearch(query);
  const isCurrent = data?.query === query;

  const crumbs = [{ label: 'Shop', to: '/shop' }, { label: `Search: ${query}`, to: `/shop?q=${encodeURIComponent(query)}` }];

  return (
    <div>
      <Seo title={`Remedies for "${query}"`} description={PAGES.shop.description} noindex />
      <PageHero
        crumbs={crumbs}
        eyebrow={
          <>
            <Sparkles size={13} aria-hidden="true" /> Smart match
          </>
        }
        title={
          <>
            Remedies for <em>“{query}”</em>
          </>
        }
        description={
          data && isCurrent
            ? data.fallback
              ? "We couldn't find an exact match, so here are our most-loved remedies."
              : `${data.count} ${data.count === 1 ? 'remedy' : 'remedies'} found`
            : undefined
        }
      >
        {data && isCurrent && data.concerns.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold text-ink-600">Sounds like</span>
            {data.concerns.map((s) => (
              <Link
                key={s.id}
                to={concernPath(s.slug)}
                className="flex items-center gap-1.5 rounded-full border border-sage-200 bg-cream-50 px-3.5 py-1.5 text-xs font-semibold text-sage-800 shadow-soft transition-colors hover:border-sage-800 hover:bg-sage-800 hover:text-cream-50"
              >
                <span aria-hidden="true">{s.icon}</span> {s.name}
              </Link>
            ))}
          </div>
        )}

        <Link to="/shop" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-600 transition-colors hover:text-sage-800">
          <X size={13} aria-hidden="true" /> Clear and browse all remedies
        </Link>
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading || !isCurrent ? <ProductGridSkeleton count={8} /> : <ProductGrid products={data?.results ?? []} headingLevel={2} animated />}
      </div>
    </div>
  );
}

function StandardShop() {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: Filters = {
    category: params.get('category') ?? undefined,
    symptom: params.get('symptom') ?? undefined,
    min_price: params.get('min_price') ?? undefined,
    max_price: params.get('max_price') ?? undefined,
    in_stock: params.get('in_stock') === 'true',
  };
  const search = params.get('search') ?? '';
  const ordering = params.get('ordering') ?? '';
  const page = Number(params.get('page') ?? '1');

  const updateParams = (updates: Record<string, string | boolean | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === false) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    next.delete('page');
    setParams(next);
  };

  const query = useMemo(
    () => ({
      search: search || undefined,
      category: filters.category,
      symptom: filters.symptom,
      min_price: filters.min_price ? Number(filters.min_price) : undefined,
      max_price: filters.max_price ? Number(filters.max_price) : undefined,
      in_stock: filters.in_stock || undefined,
      is_featured: params.get('is_featured') === 'true' || undefined,
      is_bestseller: params.get('is_bestseller') === 'true' || undefined,
      ordering: ordering || undefined,
      page,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, filters.category, filters.symptom, filters.min_price, filters.max_price, filters.in_stock, ordering, page, params],
  );

  const { data, isLoading, isFetching } = useProducts(query);

  const { data: symptoms } = useSymptoms();
  const { data: categories } = useCategories();
  const symptomName = symptoms?.find((s) => s.slug === filters.symptom)?.name;
  const categoryName = categories?.find((c) => c.slug === filters.category)?.name;
  const view = shopView({
    search,
    symptomName,
    categoryName,
    bestsellers: params.get('is_bestseller') === 'true',
    featured: params.get('is_featured') === 'true',
  });
  const crumbs: Crumb[] = [{ label: 'Shop', to: '/shop' }, ...(view.crumb ? [{ label: view.crumb, to: `/shop?${params}` }] : [])];

  // What's narrowing the list right now, each with a way to drop it.
  const activeFilters = [
    filters.symptom && { key: 'symptom', label: symptomName ?? filters.symptom, clear: { symptom: undefined } },
    filters.category && { key: 'category', label: categoryName ?? filters.category, clear: { category: undefined } },
    (filters.min_price || filters.max_price) && {
      key: 'price',
      label: `KES ${filters.min_price || '0'} – ${filters.max_price || 'any'}`,
      clear: { min_price: undefined, max_price: undefined },
    },
    filters.in_stock && { key: 'stock', label: 'In stock', clear: { in_stock: undefined } },
    search && { key: 'search', label: `“${search}”`, clear: { search: undefined } },
  ].filter(Boolean) as { key: string; label: string; clear: Record<string, undefined> }[];

  return (
    <div>
      {/* Filtered views point search engines at /shop, or at the concern's own page, so they aren't counted as duplicates. */}
      <Seo
        title={view.title}
        description={PAGES.shop.description}
        path={filters.symptom && symptomName ? concernPath(filters.symptom) : '/shop'}
        noindex={!!search}
        jsonLd={graph(breadcrumbJsonLd(crumbs))}
      />
      <PageHero
        crumbs={crumbs}
        eyebrow={search ? `Results for "${search}"` : filters.symptom ? 'Shopping by concern' : 'Shop all'}
        title={view.heading}
        description={typeof data?.count === 'number' ? `${data.count} ${data.count === 1 ? 'remedy' : 'remedies'} found` : undefined}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className={mobileFiltersOpen ? 'block' : 'hidden lg:block'}>
            <FilterSidebar filters={filters} onChange={updateParams} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={<SlidersHorizontal size={14} />}
                onClick={() => setMobileFiltersOpen((v) => !v)}
                aria-expanded={mobileFiltersOpen}
                className="lg:hidden"
              >
                Filters
                {activeFilters.length > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-900">
                    {activeFilters.length}
                  </span>
                )}
              </Button>

              {activeFilters.length > 0 && (
                <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
                  {activeFilters.map((filter) => (
                    <li key={filter.key}>
                      <button
                        onClick={() => updateParams(filter.clear)}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-sage-100 py-1.5 pl-3.5 pr-2.5 text-xs font-semibold text-sage-800 transition-colors hover:bg-sage-800 hover:text-cream-50"
                      >
                        {filter.label}
                        <X size={13} aria-hidden="true" />
                        <span className="sr-only">Remove filter</span>
                      </button>
                    </li>
                  ))}
                  {activeFilters.length > 1 && (
                    <li>
                      <Link to="/shop" className="link-sweep text-xs font-semibold text-ink-600 hover:text-sage-800">
                        Clear all
                      </Link>
                    </li>
                  )}
                </ul>
              )}

              <div className="ml-auto">
                <SortSelect ordering={ordering} onChange={(value) => updateParams({ ordering: value })} />
              </div>
            </div>

            {isLoading ? (
              <ProductGridSkeleton count={6} className={GRID_BESIDE_FILTERS} />
            ) : (
              <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                <ProductGrid products={data?.results ?? []} headingLevel={2} className={GRID_BESIDE_FILTERS} />
              </div>
            )}

            {data && (data.next || data.previous) && (
              <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowLeft size={14} />}
                  disabled={!data.previous}
                  onClick={() => updateParams({ page: String(page - 1) })}
                >
                  Previous
                </Button>
                <span className="font-display text-lg italic text-sage-900">Page {page}</span>
                <Button variant="outline" size="sm" disabled={!data.next} onClick={() => updateParams({ page: String(page + 1) })}>
                  Next
                  <ArrowRight size={14} aria-hidden="true" />
                </Button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Heading, tab title and breadcrumb label for the current filter, so each view is named for what it shows. */
function shopView({
  search,
  symptomName,
  categoryName,
  bestsellers,
  featured,
}: {
  search: string;
  symptomName?: string;
  categoryName?: string;
  bestsellers: boolean;
  featured: boolean;
}) {
  if (search) return { heading: 'Search results', title: `Search: ${search}`, crumb: `Search: ${search}` };
  if (symptomName) {
    return {
      heading: `Remedies traditionally used for ${symptomName}`,
      title: `Herbs Traditionally Used for ${symptomName}`,
      crumb: symptomName,
    };
  }
  if (categoryName) return { heading: categoryName, title: `${categoryName} — Herbal Remedies`, crumb: categoryName };
  if (bestsellers) return { heading: 'Bestsellers', title: 'Bestselling Herbal Remedies', crumb: 'Bestsellers' };
  if (featured) return { heading: 'Featured remedies', title: 'Featured Herbal Remedies', crumb: 'Featured' };
  return { heading: 'Every remedy, in one place', title: PAGES.shop.title, crumb: undefined };
}

function SortSelect({ ordering, onChange }: { ordering: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <select
        aria-label="Sort products"
        value={ordering}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-cream-300 bg-cream-50 pl-4 pr-10 text-sm font-semibold text-ink-800 shadow-soft transition-[border-color,box-shadow] hover:border-cream-400 focus:border-sage-600 focus:outline-none focus:ring-4 focus:ring-sage-600/15 focus-visible:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-700" />
    </div>
  );
}
