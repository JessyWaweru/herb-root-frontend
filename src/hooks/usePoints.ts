import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchPoints, redeemReward } from '../lib/points';
import { apiErrorMessage } from '../lib/api';

export function usePoints() {
  return useQuery({ queryKey: ['points'], queryFn: fetchPoints });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: redeemReward,
    onSuccess: (redemption) => {
      queryClient.invalidateQueries({ queryKey: ['points'] });
      toast.success(`Done! Your voucher code is ${redemption.code}`);
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not redeem this reward.')),
  });
}
