import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { buttonClasses, type Size, type Variant } from './buttonStyles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, icon, className, children, disabled, ...props }, ref) => {
    return (
      <button ref={ref} disabled={disabled || isLoading} className={buttonClasses(variant, size, className)} {...props}>
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

interface ButtonLinkProps extends LinkProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

/** A link that looks like a Button, for actions that go to another page. */
export function ButtonLink({ variant = 'primary', size = 'md', icon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}
