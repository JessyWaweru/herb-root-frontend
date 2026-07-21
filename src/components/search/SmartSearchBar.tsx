import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useSmartSearchNavigate } from '../../hooks/useSmartSearch';

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
  const smartSearch = useSmartSearchNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    smartSearch(value);
    onNavigate?.();
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div
        className={clsx(
          'flex w-full items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-4 py-2',
          inputClassName,
        )}
      >
        <Search size={16} className="shrink-0 text-ink-600/60" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink-800 placeholder:text-ink-600/50 focus:outline-none"
        />
        <Sparkles size={15} className="shrink-0 text-sage-500" aria-hidden="true" />
      </div>
    </form>
  );
}
