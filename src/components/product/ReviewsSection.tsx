import { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { formatDate } from '../../lib/format';
import { useCreateReview } from '../../hooks/useProducts';
import { useAuthStore } from '../../stores/authStore';
import type { Review } from '../../types';

export function ReviewsSection({ productSlug, reviews }: { productSlug: string; reviews: Review[] }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const createReview = useCreateReview(productSlug);

  const alreadyReviewed = false; // backend enforces one-per-user; surfaced via error toast

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    createReview.mutate(
      { rating, title, comment },
      {
        onSuccess: () => {
          setRating(0);
          setTitle('');
          setComment('');
        },
      },
    );
  };

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h3 className="font-display text-xl text-sage-900">Customer reviews</h3>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-ink-600">No reviews yet — be the first to share your experience.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-cream-300 pb-5 last:border-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-sage-900">{review.user_name}</p>
                  <span className="text-xs text-ink-600/70">{formatDate(review.created_at)}</span>
                </div>
                <StarRating value={review.rating} size={14} />
                {review.is_verified_purchase && (
                  <span className="mt-1 inline-block rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-700">
                    Verified purchase
                  </span>
                )}
                {review.title && <p className="mt-2 text-sm font-semibold text-ink-800">{review.title}</p>}
                {review.comment && <p className="mt-1 text-sm text-ink-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-cream-300 bg-cream-50 p-6">
        <h4 className="font-display text-lg text-sage-900">Leave a review</h4>
        {!isAuthenticated ? (
          <p className="mt-2 text-sm text-ink-600">
            <Link to="/login" className="font-semibold text-sage-700 underline">
              Sign in
            </Link>{' '}
            to share your experience with this remedy.
          </p>
        ) : alreadyReviewed ? (
          <p className="mt-2 text-sm text-ink-600">You've already reviewed this product. Thank you!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button type="button" key={i} onClick={() => setRating(i + 1)}>
                  <Star
                    size={22}
                    className={clsx(
                      i < rating ? 'fill-gold-500 text-gold-500' : 'fill-transparent text-cream-300',
                    )}
                  />
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you notice after using this?"
              rows={4}
            />
            <Button type="submit" disabled={!rating} isLoading={createReview.isPending}>
              Submit review
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
