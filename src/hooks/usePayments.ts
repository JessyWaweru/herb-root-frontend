import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MPESA_PROMPT_MS, chargeMpesa, initializePayment, verifyPayment, type PaymentTarget } from '../lib/payments';

/** How the customer chose to pay: a prompt on their phone, or Paystack's own page (card, M-Pesa and more). */
export interface PaymentChoice {
  method: 'mpesa' | 'paystack';
  phone: string;
}

interface PayVariables {
  target: PaymentTarget;
  choice: PaymentChoice;
  /** The order or booking page, where the customer waits for the M-Pesa prompt or returns from Paystack. */
  returnPath: string;
}

/** Starts a payment: sends the M-Pesa prompt and opens the page that waits for it, or goes to Paystack. */
export function usePay() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ target, choice }: PayVariables) =>
      choice.method === 'mpesa'
        ? { mpesaReference: (await chargeMpesa(target, choice.phone)).reference }
        : { redirectTo: (await initializePayment(target)).authorization_url },
    onSuccess: (result, { returnPath }) => {
      if (result.redirectTo) window.location.href = result.redirectTo;
      else navigate(`${returnPath}?reference=${result.mpesaReference}&via=mpesa`, { replace: true });
    },
  });
}

/**
 * Confirms the payment named in the page's URL, then calls `onSettled` (to reload the order or booking).
 *
 * Coming back from Paystack's page, one check is enough. After an M-Pesa prompt, the customer may still be
 * entering their PIN, so this keeps checking until M-Pesa answers or the prompt has expired.
 */
export function usePaymentConfirmation(reference: string | null, waitForPin: boolean, onSettled: () => Promise<unknown>) {
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const [gaveUpOn, setGaveUpOn] = useState<string | null>(null);
  const gaveUp = Boolean(reference) && gaveUpOn === reference;

  const query = useQuery({
    queryKey: ['payment', reference],
    queryFn: () => verifyPayment(reference!),
    enabled: Boolean(reference),
    retry: false,
    staleTime: 0,
    refetchInterval: (q) => (waitForPin && q.state.data?.status === 'pending' && gaveUpOn !== reference ? 4000 : false),
  });

  useEffect(() => {
    if (!reference || !waitForPin) return;
    const timer = setTimeout(() => setGaveUpOn(reference), MPESA_PROMPT_MS);
    return () => clearTimeout(timer);
  }, [reference, waitForPin]);

  const status = query.data?.status;
  const waitingForPin = waitForPin && status === 'pending' && !gaveUp;
  const settled = Boolean(reference) && (query.isError || (status !== undefined && !waitingForPin));

  useEffect(() => {
    if (settled && doneFor !== reference) onSettled().finally(() => setDoneFor(reference));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settled, reference]);

  return {
    /** Still checking with Paystack (or reloading after); show a spinner rather than a stale status. */
    checking: Boolean(reference) && !waitingForPin && doneFor !== reference,
    waitingForPin,
    /** The payment that was just attempted didn't go through (declined, cancelled, or no answer in time). */
    failed: doneFor === reference && Boolean(reference) && (status === 'failed' || status === 'abandoned' || gaveUp),
  };
}
