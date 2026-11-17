import clsx from 'clsx';

/** Shared look for every text field: its own soft ring on focus instead of the global outline. */
export const fieldClasses = (error?: string) =>
  clsx(
    'w-full rounded-2xl border bg-cream-50 px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-600/80',
    'shadow-[inset_0_1px_2px_rgba(10,56,41,0.04)] transition-[border-color,box-shadow] duration-200',
    'hover:border-cream-400 focus:outline-none focus-visible:outline-none focus:ring-4',
    error
      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
      : 'border-cream-300 focus:border-sage-600 focus:ring-sage-600/15',
  );

export const labelClasses = 'text-[13px] font-semibold text-ink-700';
