import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { fieldClasses, labelClasses } from './fieldStyles';

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <span className="text-xs font-medium text-rose-600">{children}</span>;
}

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
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={clsx(fieldClasses(error), className)} {...props} />
        <FieldError>{error}</FieldError>
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
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={inputId} className={clsx(fieldClasses(error), 'resize-none', className)} {...props} />
        <FieldError>{error}</FieldError>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
