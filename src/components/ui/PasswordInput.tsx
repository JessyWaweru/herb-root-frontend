import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import { FieldError } from './Input';
import { fieldClasses, labelClasses } from './fieldStyles';

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
          <label htmlFor={inputId} className={labelClasses}>
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
            className={clsx(fieldClasses(error), 'pr-12', className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            aria-controls={inputId}
            className="absolute inset-y-0 right-1.5 my-auto flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition hover:bg-sage-100 hover:text-sage-800"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError>{error}</FieldError>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
