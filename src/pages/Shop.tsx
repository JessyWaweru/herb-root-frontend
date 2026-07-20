import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { FilterSidebar, type Filters } from '../components/product/FilterSidebar';
import { ProductGrid } from '../components/product/ProductGrid';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: '-average_rating', label: 'Top rated' },
  { value: 'name', label: 'Name: A-Z' },
];

export function Shop() {
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

  const activeSymptomLabel = filters.symptom;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">
          {search ? `Results for "${search}"` : activeSymptomLabel ? 'Shopping by concern' : 'Shop all'}
        </span>
        <h1 className="mt-1 font-display text-3xl text-sage-900 sm:text-4xl">
          {search ? 'Search results' : 'Every remedy, in one place'}
        </h1>
        {typeof data?.count === 'number' && (
          <p className="mt-2 text-sm text-ink-600">{data.count} remedies found</p>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
        <Button variant="outline" size="sm" icon={<SlidersHorizontal size={14} />} onClick={() => setMobileFiltersOpen((v) => !v)}>
          Filters
        </Button>
        <SortSelect ordering={ordering} onChange={(value) => updateParams({ ordering: value })} />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className={mobileFiltersOpen ? 'block' : 'hidden lg:block'}>
          <FilterSidebar filters={filters} onChange={updateParams} />
        </div>

        <div className="flex-1">
          <div className="mb-6 hidden justify-end lg:flex">
            <SortSelect ordering={ordering} onChange={(value) => updateParams({ ordering: value })} />
          </div>

          {isLoading ? (
            <Spinner />
          ) : (
            <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              <ProductGrid products={data?.results ?? []} />
            </div>
          )}

          {data && (data.next || data.previous) && (
            <div className="mt-10 flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.previous}
                onClick={() => updateParams({ page: String(page - 1) })}
              >
                Previous
              </Button>
              <span className="flex items-center px-2 text-sm text-ink-600">Page {page}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.next}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SortSelect({ ordering, onChange }: { ordering: string; onChange: (value: string) => void }) {
  return (
    <select
      value={ordering}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-cream-300 bg-cream-50 px-4 py-2 text-sm text-ink-700 focus:outline-none focus:ring-2 focus:ring-sage-400"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          Sort: {opt.label}
        </option>
      ))}
    </select>
  );
}
