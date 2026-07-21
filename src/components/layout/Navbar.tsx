import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Leaf, LogOut, Menu, ShoppingBasket, User, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from '../../hooks/useCart';
import { useLogout } from '../../hooks/useAuth';
import { SmartSearchBar } from '../search/SmartSearchBar';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/concerns', label: 'Shop by Concern' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { data: cart } = useCart();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300 bg-cream-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-800 text-cream-50">
            <Leaf size={18} className="animate-leaf-sway" />
          </span>
          <span className="font-display text-xl text-sage-900">Herb &amp; Root</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-ink-700 transition hover:text-sage-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <SmartSearchBar
          placeholder="Search, or describe how you feel..."
          className="ml-auto hidden flex-1 max-w-sm items-center md:flex"
        />

        <div className="ml-auto flex items-center gap-1.5 md:ml-3">
          <Link
            to="/account/wishlist"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-sage-100 sm:flex"
            aria-label="Wishlist"
          >
            <Heart size={19} />
          </Link>

          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-sage-100"
            aria-label="Cart"
          >
            <ShoppingBasket size={19} />
            {Boolean(cart?.total_items) && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {cart!.total_items}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="group relative">
              <Link
                to="/account"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-800 transition hover:bg-sage-200"
                aria-label="Account"
              >
                <User size={18} />
              </Link>
              <div className="invisible absolute right-0 mt-1 w-48 rounded-2xl border border-cream-300 bg-cream-50 p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100">
                <p className="truncate px-3 py-1.5 text-xs text-ink-600">{user?.email}</p>
                <Link to="/account" className="block rounded-lg px-3 py-2 text-sm text-ink-800 hover:bg-sage-50">
                  My account
                </Link>
                <Link
                  to="/account/orders"
                  className="block rounded-lg px-3 py-2 text-sm text-ink-800 hover:bg-sage-50"
                >
                  Orders
                </Link>
                <button
                  onClick={() => logout.mutate()}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-full bg-sage-600 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-sage-700 sm:block"
            >
              Sign in
            </Link>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-sage-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-cream-300 bg-cream-100 px-4 py-4 lg:hidden">
          <SmartSearchBar
            placeholder="Search, or describe how you feel..."
            className="mb-4 flex"
            onNavigate={() => setMobileOpen(false)}
          />
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-sage-50"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-xl bg-sage-600 px-3 py-2.5 text-center text-sm font-semibold text-cream-50"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
