import clsx from 'clsx';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-sage-600 text-cream-50 hover:bg-sage-700 shadow-soft',
  secondary: 'bg-gold-500 text-ink-900 hover:bg-gold-600 shadow-soft',
  outline: 'border border-sage-400 text-sage-800 hover:bg-sage-50',
  ghost: 'text-sage-800 hover:bg-sage-100',
  danger: 'bg-rose-600 text-cream-50 hover:bg-rose-700',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3.5 gap-2.5',
};

/** Button styling for elements that can't be a Button or ButtonLink, e.g. in-page anchors. */
export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return clsx(
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}
