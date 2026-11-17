import clsx from 'clsx';
import { useCategories, useSymptoms } from '../../hooks/useProducts';

export interface Filters {
  category?: string;
  symptom?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: boolean;
}

const priceField =
  'w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600 transition-[border-color,box-shadow] hover:border-cream-400 focus:border-sage-600 focus:outline-none focus:ring-4 focus:ring-sage-600/15 focus-visible:outline-none';

export function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Record<string, string | boolean | undefined>) => void;
}) {
  const { data: categories } = useCategories();
  const { data: symptoms } = useSymptoms();

  return (
    <aside className="card flex w-full flex-col gap-7 p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7.5rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto">
      <FilterGroup title="Concern">
        <FilterButton active={!filters.symptom} label="All concerns" onClick={() => onChange({ symptom: undefined })} />
        {symptoms?.map((s) => (
          <FilterButton
            key={s.id}
            active={filters.symptom === s.slug}
            icon={s.icon}
            label={s.name}
            count={s.product_count}
            onClick={() => onChange({ symptom: filters.symptom === s.slug ? undefined : s.slug })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        <FilterButton active={!filters.category} label="All categories" onClick={() => onChange({ category: undefined })} />
        {categories?.map((c) => (
          <FilterButton
            key={c.id}
            active={filters.category === c.slug}
            icon={c.icon}
            label={c.name}
            count={c.product_count}
            onClick={() => onChange({ category: filters.category === c.slug ? undefined : c.slug })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price (KES)">
        <div className="flex w-full items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            aria-label="Lowest price"
            value={filters.min_price ?? ''}
            onChange={(e) => onChange({ min_price: e.target.value || undefined })}
            className={priceField}
          />
          <span aria-hidden="true" className="text-ink-600">
            –
          </span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            aria-label="Highest price"
            value={filters.max_price ?? ''}
            onChange={(e) => onChange({ max_price: e.target.value || undefined })}
            className={priceField}
          />
        </div>
      </FilterGroup>

      <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-cream-200 pt-5 text-sm font-semibold text-ink-800">
        In stock only
        <span className="relative inline-flex">
          <input
            type="checkbox"
            checked={Boolean(filters.in_stock)}
            onChange={(e) => onChange({ in_stock: e.target.checked || undefined })}
            className="peer sr-only"
          />
          {/* The switch is drawn from the hidden checkbox's state, so it keeps keyboard and screen reader support. */}
          <span className="h-6 w-11 rounded-full bg-cream-300 transition-colors duration-200 peer-checked:bg-sage-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sage-600" />
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream-50 shadow-soft transition-transform duration-200 peer-checked:translate-x-5" />
        </span>
      </label>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-3 text-sage-700">{title}</h2>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterButton({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean;
  icon?: string;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-[13px] font-medium transition-colors duration-150',
        active
          ? 'border-sage-800 bg-sage-800 font-semibold text-cream-50'
          : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-sage-400 hover:bg-sage-50 hover:text-sage-900',
      )}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
      {typeof count === 'number' && (
        <span className={clsx('text-[11px] tabular-nums', active ? 'text-cream-100/80' : 'text-ink-600')}>{count}</span>
      )}
    </button>
  );
}
