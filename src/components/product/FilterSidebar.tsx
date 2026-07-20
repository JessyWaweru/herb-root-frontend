import clsx from 'clsx';
import { useCategories, useSymptoms } from '../../hooks/useProducts';

export interface Filters {
  category?: string;
  symptom?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: boolean;
}

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
    <aside className="flex w-full flex-col gap-8 lg:w-64 lg:shrink-0">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-700">Concern</h3>
        <div className="flex flex-col gap-1">
          <FilterButton
            active={!filters.symptom}
            label="All concerns"
            onClick={() => onChange({ symptom: undefined })}
          />
          {symptoms?.map((s) => (
            <FilterButton
              key={s.id}
              active={filters.symptom === s.slug}
              label={`${s.icon} ${s.name}`}
              count={s.product_count}
              onClick={() => onChange({ symptom: filters.symptom === s.slug ? undefined : s.slug })}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-700">Category</h3>
        <div className="flex flex-col gap-1">
          <FilterButton
            active={!filters.category}
            label="All categories"
            onClick={() => onChange({ category: undefined })}
          />
          {categories?.map((c) => (
            <FilterButton
              key={c.id}
              active={filters.category === c.slug}
              label={`${c.icon} ${c.name}`}
              count={c.product_count}
              onClick={() => onChange({ category: filters.category === c.slug ? undefined : c.slug })}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sage-700">Price (KES)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.min_price ?? ''}
            onChange={(e) => onChange({ min_price: e.target.value || undefined })}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
          <span className="text-ink-600/50">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.max_price ?? ''}
            onChange={(e) => onChange({ max_price: e.target.value || undefined })}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={Boolean(filters.in_stock)}
          onChange={(e) => onChange({ in_stock: e.target.checked || undefined })}
          className="h-4 w-4 rounded border-cream-300 text-sage-600 focus:ring-sage-400"
        />
        In stock only
      </label>
    </aside>
  );
}

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm transition',
        active ? 'bg-sage-600 text-cream-50' : 'text-ink-700 hover:bg-sage-50',
      )}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span className={clsx('text-xs', active ? 'text-cream-100/80' : 'text-ink-600/60')}>{count}</span>
      )}
    </button>
  );
}
