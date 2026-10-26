import { api } from './api';
import type { PointsSummary, ProductToReview, Redemption } from '../types';

export async function fetchPoints() {
  const { data } = await api.get<PointsSummary>('/points/');
  return data;
}

export async function redeemReward(rewardId: string) {
  const { data } = await api.post<Redemption>('/points/redeem/', { reward_id: rewardId });
  return data;
}

/** A product to ask the customer to review, or null. Asking counts as showing it, so only call when about to. */
export async function fetchReviewPrompt() {
  const res = await api.post<{ product: ProductToReview; points: number } | ''>('/points/review-prompt/');
  return res.status === 204 || !res.data ? null : res.data;
}

export async function stopReviewReminders(token: string) {
  const { data } = await api.post<{ detail: string }>('/points/reminders/unsubscribe/', { token });
  return data;
}
