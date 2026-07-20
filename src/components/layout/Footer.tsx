import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeNewsletter } from '../../lib/core';
import { apiErrorMessage } from '../../lib/api';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { detail } = await subscribeNewsletter(email);
      toast.success(detail);
      setEmail('');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not subscribe right now.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-24 border-t border-cream-300 bg-sage-900 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-700">
                <Leaf size={18} />
              </span>
              <span className="font-display text-xl">Herb &amp; Root</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-cream-200/80">
              Herbal remedies chosen by what you feel — grown with care, explained with honesty.
            </p>
            <div className="mt-4 flex gap-3 text-lg text-cream-200/80">
              <a href="#" aria-label="Instagram" className="hover:text-cream-50">
                📷
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-cream-50">
                📘
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-cream-50">
                🐦
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream-200/70">Shop</h4>
            <ul className="space-y-2 text-sm text-cream-100/90">
              <li><Link to="/shop" className="hover:text-gold-400">All remedies</Link></li>
              <li><Link to="/#symptoms" className="hover:text-gold-400">Shop by concern</Link></li>
              <li><Link to="/shop?is_bestseller=true" className="hover:text-gold-400">Bestsellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream-200/70">Company</h4>
            <ul className="space-y-2 text-sm text-cream-100/90">
              <li><Link to="/about" className="hover:text-gold-400">Our story</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400">Contact us</Link></li>
              <li><Link to="/account/orders" className="hover:text-gold-400">Track an order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream-200/70">
              Join the garden letter
            </h4>
            <p className="mb-3 text-sm text-cream-100/80">Seasonal remedies &amp; growing notes, monthly.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-sage-700 bg-sage-800 px-4 py-2 text-sm text-cream-50 placeholder:text-cream-200/50 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500 text-ink-900 transition hover:bg-gold-400 disabled:opacity-50"
                aria-label="Subscribe"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sage-700 pt-6 text-xs text-cream-200/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Herb &amp; Root. All rights reserved.</p>
          <p>Grown across Kenya's highlands and coast.</p>
        </div>
      </div>
    </footer>
  );
}
