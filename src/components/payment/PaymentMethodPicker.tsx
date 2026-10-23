import clsx from 'clsx';
import { CreditCard, Smartphone } from 'lucide-react';
import { Input } from '../ui/Input';
import type { PaymentChoice } from '../../hooks/usePayments';

const METHODS = [
  { value: 'mpesa', label: 'M-Pesa', hint: 'Get a prompt on your phone', icon: Smartphone },
  { value: 'paystack', label: 'Card or other', hint: 'Pay on Paystack’s page', icon: CreditCard },
] as const;

interface Props {
  value: PaymentChoice;
  onChange: (value: PaymentChoice) => void;
  phoneError?: string;
  /** Keeps ids unique when the form sits on a page with other fields. */
  idPrefix?: string;
}

export function PaymentMethodPicker({ value, onChange, phoneError, idPrefix = 'pay' }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="text-sm font-medium text-ink-700">How would you like to pay?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {METHODS.map(({ value: method, label, hint, icon: Icon }) => (
            <label
              key={method}
              className={clsx(
                'flex cursor-pointer flex-col items-start gap-0.5 rounded-xl border p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-400',
                value.method === method ? 'border-sage-500 bg-sage-50 ring-1 ring-sage-500' : 'border-cream-300 hover:border-sage-300',
              )}
            >
              <input
                type="radio"
                name={`${idPrefix}-method`}
                value={method}
                checked={value.method === method}
                onChange={() => onChange({ ...value, method })}
                className="sr-only"
              />
              <Icon size={18} className="text-sage-700" aria-hidden />
              <span className="mt-1 text-sm font-semibold text-sage-900">{label}</span>
              <span className="text-xs text-ink-600">{hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {value.method === 'mpesa' && (
        <Input
          id={`${idPrefix}-mpesa-phone`}
          label="M-Pesa number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="07xx xxx xxx"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          error={phoneError}
          aria-describedby={`${idPrefix}-mpesa-hint`}
        />
      )}
      {value.method === 'mpesa' && (
        <p id={`${idPrefix}-mpesa-hint`} className="-mt-2 text-xs text-ink-600">
          We'll send a payment prompt to this phone. Enter your M-Pesa PIN there to pay.
        </p>
      )}
    </div>
  );
}
