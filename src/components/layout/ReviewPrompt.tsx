import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { fetchReviewPrompt } from '../../lib/points';
import { updateMe } from '../../lib/auth';
import { resolveMediaUrl } from '../../lib/format';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import type { ProductToReview } from '../../types';

// Rarely: at most one try per visit, only on some visits, and never while the customer is busy.
// The server also waits a couple of weeks between pop-ups, across all their devices.
const CHANCE_PER_VISIT = 0.3;
const DELAY_MS = 20_000;
const BUSY_PATHS = ['/cart', '/checkout', '/account', '/orders', '/consultations'];
const TRIED_KEY = 'review-prompt-tried';

function triedThisVisit() {
  try {
    return sessionStorage.getItem(TRIED_KEY) !== null;
  } catch {
    // Storage blocked: fall back to the server's own limit.
    return false;
  }
}

function markTried() {
  try {
    sessionStorage.setItem(TRIED_KEY, '1');
  } catch {
    // As above.
  }
}

/** Now and then, asks a signed-in customer to review something they've received. */
export function ReviewPrompt() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<{ product: ProductToReview; points: number } | null>(null);
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  const wanted = isAuthenticated && user?.review_reminders !== false;

  useEffect(() => {
    if (!wanted || triedThisVisit() || Math.random() > CHANCE_PER_VISIT) return;
    const timer = window.setTimeout(async () => {
      markTried();
      if (BUSY_PATHS.some((path) => pathRef.current.startsWith(path))) return;
      try {
        setPrompt(await fetchReviewPrompt());
      } catch {
        // Not worth bothering anyone about.
      }
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [wanted]);

  if (!prompt) return null;
  const { product, points } = prompt;

  const stopReminders = async () => {
    setPrompt(null);
    try {
      setUser(await updateMe({ review_reminders: false }));
    } catch {
      // They can still turn reminders off from their account.
    }
  };

  return (
    <Dialog open onClose={() => setPrompt(null)} title="How did it work for you?">
      <div className="flex items-center gap-4">
        <img src={resolveMediaUrl(product.primary_image_url)} alt="" className="h-16 w-16 rounded-xl object-cover" />
        <p className="text-sm text-ink-700">
          You've had <strong className="text-sage-900">{product.name}</strong> for a little while. An honest review, good
          or bad, helps others choose, and earns you <strong className="text-sage-900">{points} Garden Points</strong>.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="ghost" onClick={() => setPrompt(null)}>
          Not now
        </Button>
        <Button
          icon={<PenLine size={15} />}
          onClick={() => {
            setPrompt(null);
            navigate(`/shop/${product.slug}#reviews`);
          }}
        >
          Write a review
        </Button>
      </div>
      <button type="button" onClick={stopReminders} className="mt-4 text-xs text-ink-600 underline">
        Don't ask me again
      </button>
    </Dialog>
  );
}
