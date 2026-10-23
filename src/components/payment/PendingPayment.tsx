import { useState } from 'react';
import toast from 'react-hot-toast';
import { Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { PaymentMethodPicker } from './PaymentMethodPicker';
import { usePay, type PaymentChoice } from '../../hooks/usePayments';
import { isMpesaNumber, type PaymentTarget } from '../../lib/payments';
import { apiErrorMessage } from '../../lib/api';
import { formatPrice } from '../../lib/format';

interface Props {
  target: PaymentTarget;
  returnPath: string;
  amount: string;
  currency: string;
  defaultPhone?: string;
  waitingForPin: boolean;
  failed: boolean;
}

/** For an unpaid order or booking: waits for the M-Pesa prompt, or lets the customer pay (again). */
export function PendingPayment({ target, returnPath, amount, currency, defaultPhone = '', waitingForPin, failed }: Props) {
  const [choice, setChoice] = useState<PaymentChoice>({ method: 'mpesa', phone: defaultPhone });
  const [phoneError, setPhoneError] = useState<string>();
  const pay = usePay();

  if (waitingForPin) {
    return (
      <div role="status" className="mt-6 flex items-start gap-3 rounded-xl bg-sage-50 p-4 text-sm text-ink-700">
        <span className="relative mt-0.5 flex shrink-0">
          <Smartphone size={22} className="text-sage-700" aria-hidden />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-sage-500" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-sage-900">Check your phone</p>
          <p>
            We've sent an M-Pesa prompt for {formatPrice(amount, currency)}. Enter your M-Pesa PIN to pay. This page
            will update by itself once M-Pesa confirms.
          </p>
        </div>
      </div>
    );
  }

  const submit = () => {
    if (choice.method === 'mpesa' && !isMpesaNumber(choice.phone)) {
      setPhoneError('Enter an M-Pesa number like 0712 345 678.');
      return;
    }
    setPhoneError(undefined);
    pay.mutate(
      { target, choice, returnPath },
      { onError: (error) => toast.error(apiErrorMessage(error, 'Could not start payment.')) },
    );
  };

  return (
    <div className="mt-6 rounded-xl border border-cream-300 p-4">
      <p role={failed ? 'alert' : undefined} className="mb-4 rounded-lg bg-gold-300/30 p-3 text-sm text-ink-700">
        {failed
          ? "We couldn't confirm that payment. If M-Pesa sent you a confirmation SMS, refresh this page in a minute. Otherwise, try again below."
          : "Payment hasn't been confirmed yet. If you've just paid, refresh this page in a moment. Otherwise, pay below."}
      </p>
      <PaymentMethodPicker value={choice} onChange={setChoice} phoneError={phoneError} idPrefix="retry" />
      <Button type="button" size="lg" className="mt-4 w-full" isLoading={pay.isPending} onClick={submit}>
        Pay {formatPrice(amount, currency)}
      </Button>
    </div>
  );
}
