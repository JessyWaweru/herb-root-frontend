import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-sage-600 text-cream-50 hover:bg-sage-700 shadow-soft',
  secondary: 'bg-gold-500 text-ink-900 hover:bg-gold-600 shadow-soft',
  outline: 'border border-sage-400 text-sage-800 hover:bg-sage-50',
  ghost: 'text-sage-800 hover:bg-sage-100',
  danger: 'bg-rose-500 text-cream-50 hover:bg-rose-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3.5 gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, icon, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
