import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { initializePayment, verifyPayment } from '../lib/payments';
import { apiErrorMessage } from '../lib/api';

export function useInitializePayment() {
  return useMutation({
    mutationFn: (orderNumber: string) => initializePayment(orderNumber),
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not start payment.')),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (reference: string) => verifyPayment(reference),
  });
}
