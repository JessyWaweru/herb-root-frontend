import clsx from 'clsx';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-sage-800 text-cream-50 shadow-press hover:bg-sage-900 not-disabled:hover:-translate-y-px',
  secondary: 'bg-gold-500 text-ink-900 shadow-gold hover:bg-gold-400 not-disabled:hover:-translate-y-px',
  outline: 'border border-sage-800/25 bg-cream-50/70 text-sage-900 hover:border-sage-800 hover:bg-sage-800 hover:text-cream-50',
  ghost: 'text-sage-800 hover:bg-sage-100',
  danger: 'bg-rose-600 text-cream-50 hover:bg-rose-700',
};

// Minimum heights rather than fixed ones, so a long label can wrap on a narrow phone.
const sizeClasses: Record<Size, string> = {
  sm: 'min-h-9 px-4 py-1.5 text-[13px] gap-1.5',
  md: 'min-h-11 px-6 py-2.5 text-sm gap-2',
  lg: 'min-h-13 px-8 py-3.5 text-[15px] gap-2.5',
};

/** Button styling for elements that can't be a Button or ButtonLink, e.g. in-page anchors. */
export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return clsx(
    'inline-flex items-center justify-center rounded-full text-center font-semibold tracking-[-0.005em]',
    'transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-[0.98]',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}
