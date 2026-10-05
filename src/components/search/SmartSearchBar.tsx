import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useSmartSearchNavigate } from '../../hooks/useSmartSearch';
import { useSmartSearch } from '../../hooks/useProducts';
import { formatPrice, resolveMediaUrl } from '../../lib/format';

const SUGGESTION_LIMIT = 5;
const DEBOUNCE_MS = 250;

export function SmartSearchBar({
  placeholder = "Search, or describe how you feel — e.g. \"I can't sleep and my head hurts\"",
  className,
  inputClassName,
  onNavigate,
}: {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onNavigate?: () => void;
}) {
  const [value, setValue] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const smartSearch = useSmartSearchNavigate();

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [value]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const { data, isFetching } = useSmartSearch(debounced, SUGGESTION_LIMIT);
  const showPanel = open && value.trim().length >= 2 && data !== undefined;
  const suggestions = data && !data.fallback ? data.results : [];

  const finish = () => {
    setOpen(false);
    setActive(-1);
    onNavigate?.();
  };

  const goToProduct = (slug: string) => {
    navigate(`/shop/${slug}`);
    setValue('');
    finish();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) {
      goToProduct(suggestions[active].slug);
      return;
    }
    smartSearch(value);
    finish();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <form ref={rootRef} onSubmit={handleSubmit} className={clsx('relative', className)} role="search">
      <div
        className={clsx(
          'flex w-full items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-4 py-2',
          inputClassName,
        )}
      >
        <Search size={16} className="shrink-0 text-ink-600/60" />
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search remedies"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-600/50 focus:outline-none"
        />
        <Sparkles
          size={15}
          className={clsx('shrink-0 text-sage-500', isFetching && 'animate-pulse')}
          aria-hidden="true"
        />
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 text-left shadow-lift">
          {data.concerns.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-cream-300 px-4 py-2.5">
              <span className="text-xs text-ink-600">Sounds like:</span>
              {data.concerns.map((c) => (
                <span key={c.id} className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-semibold text-sage-800">
                  {c.icon} {c.name}
                </span>
              ))}
            </div>
          )}

          {suggestions.length > 0 ? (
            <ul role="listbox">
              {suggestions.map((p, i) => (
                <li key={p.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.slug)}
                    className={clsx(
                      'flex w-full items-center gap-3 px-4 py-2 text-left transition',
                      i === active ? 'bg-sage-50' : 'hover:bg-sage-50',
                    )}
                  >
                    <img
                      src={resolveMediaUrl(p.primary_image_url)}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg bg-sage-50 object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-800">{p.name}</span>
                      <span className="block truncate text-xs text-ink-600">{p.short_description}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-sage-700">
                      {formatPrice(p.price, p.currency)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-ink-600">No exact match yet — try describing how you feel.</p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-between border-t border-cream-300 px-4 py-2.5 text-sm font-semibold text-sage-700 transition hover:bg-sage-50"
          >
            {data.fallback ? 'Browse popular remedies' : `See all ${data.count} results`}
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </form>
  );
}
