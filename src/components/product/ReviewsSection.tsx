import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Sprout, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { fieldClasses } from '../ui/fieldStyles';
import { Eyebrow } from '../ui/SectionHeading';
import { formatDate } from '../../lib/format';
import { useCreateReview } from '../../hooks/useProducts';
import { useAuthStore } from '../../stores/authStore';
import type { Review } from '../../types';

const RATING_WORDS = ['', 'Not for me', 'Could be better', 'It was okay', 'Really good', 'Loved it'];

export function ReviewsSection({ productSlug, reviews }: { productSlug: string; reviews: Review[] }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');
  const createReview = useCreateReview(productSlug);
  const [justReviewed, setJustReviewed] = useState(false);

  const { hash } = useLocation();
  const sectionRef = useRef<HTMLDivElement>(null);

  // One review per customer: once theirs exists, thank them instead of showing the form again.
  const alreadyReviewed = justReviewed || reviews.some((review) => review.is_mine);

  // Review emails and the review pop-up link straight here.
  useEffect(() => {
    if (hash === '#reviews') sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

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
          setJustReviewed(true);
        },
      },
    );
  };

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const shown = hovered || rating;

  return (
    <div ref={sectionRef} id="reviews" className="grid scroll-mt-28 gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div>
        <Eyebrow>In their words</Eyebrow>
        <h2 className="mt-4 font-display text-3xl text-sage-900 sm:text-4xl">Customer reviews</h2>

        {reviews.length === 0 ? (
          <p className="mt-4 text-ink-600">No reviews yet — be the first to share your experience.</p>
        ) : (
          <>
            <div className="mt-6 flex items-center gap-5 border-b border-cream-300 pb-6">
              <span className="font-display text-6xl leading-none text-sage-900">{average.toFixed(1)}</span>
              <div>
                <StarRating value={average} size={18} />
                <p className="mt-1.5 text-sm text-ink-600">
                  From {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
            <ul className="flex flex-col">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-cream-300 py-6 last:border-0">
                  <div className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 font-display text-lg text-sage-800"
                    >
                      {review.user_name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className="text-sm font-semibold text-sage-900">{review.user_name}</p>
                        <span className="text-xs text-ink-600">{formatDate(review.created_at)}</span>
                      </div>
                      <div className="mt-1">
                        <StarRating value={review.rating} size={14} />
                      </div>
                      {(review.is_verified_purchase || review.earned_points) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {review.is_verified_purchase && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-0.5 text-[11px] font-semibold text-sage-800">
                              <BadgeCheck size={12} aria-hidden="true" /> Verified purchase
                            </span>
                          )}
                          {review.earned_points && (
                            <span className="inline-block rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-semibold text-ink-700">
                              Earned Garden Points for reviewing
                            </span>
                          )}
                        </div>
                      )}
                      {review.title && <p className="mt-3 font-display text-lg leading-snug text-sage-900">{review.title}</p>}
                      {review.comment && <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{review.comment}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="card h-fit p-6 sm:p-8 lg:sticky lg:top-28">
        <h3 className="font-display text-2xl text-sage-900">Leave a review</h3>
        {!isAuthenticated ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            <Link to="/login" className="font-semibold text-sage-700 underline underline-offset-2">
              Sign in
            </Link>{' '}
            to share your experience with this remedy.
          </p>
        ) : alreadyReviewed ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-600">You've already reviewed this product. Thank you!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div>
              <div className="flex gap-1.5" role="group" aria-label="Your rating" onMouseLeave={() => setHovered(0)}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHovered(i + 1)}
                    aria-label={`${i + 1} star${i ? 's' : ''}`}
                    aria-pressed={rating === i + 1}
                    className="rounded-full p-0.5 transition-transform duration-150 hover:scale-125 active:scale-95"
                  >
                    <Star size={28} className={clsx('transition-colors', i < shown ? 'fill-gold-500 text-gold-500' : 'fill-cream-200 text-cream-400')} />
                  </button>
                ))}
              </div>
              <p className="mt-2 h-5 font-display text-sm italic text-sage-700" aria-hidden="true">
                {RATING_WORDS[shown]}
              </p>
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              aria-label="Review title (optional)"
              className={fieldClasses()}
            />
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you notice after using this?"
              aria-label="Your review"
              rows={4}
              maxLength={3000}
            />
            <Button type="submit" size="lg" disabled={!rating} isLoading={createReview.isPending}>
              Submit review
            </Button>
            <p className="flex items-start gap-2 rounded-2xl bg-sage-50 p-3.5 text-xs leading-relaxed text-ink-700">
              <Sprout size={15} className="mt-px shrink-0 text-sage-600" aria-hidden="true" />
              Bought and received this? A review of a couple of sentences earns Garden Points, whatever your rating.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
