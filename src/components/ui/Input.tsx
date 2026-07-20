import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'rounded-xl border bg-cream-50 px-4 py-2.5 text-ink-900 placeholder:text-ink-600/50',
            'focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition',
            error ? 'border-rose-400' : 'border-cream-300',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-600">{error}</span>}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            'rounded-xl border bg-cream-50 px-4 py-2.5 text-ink-900 placeholder:text-ink-600/50',
            'focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition resize-none',
            error ? 'border-rose-400' : 'border-cream-300',
            className,
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-600">{error}</span>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
