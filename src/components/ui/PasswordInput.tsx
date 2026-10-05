import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={clsx(
              'w-full rounded-xl border bg-cream-50 py-2.5 pl-4 pr-12 text-ink-900 placeholder:text-ink-600/50',
              'transition focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400',
              error ? 'border-rose-400' : 'border-cream-300',
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            aria-controls={inputId}
            className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition hover:bg-sage-50 hover:text-sage-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <span className="text-xs text-rose-600">{error}</span>}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
