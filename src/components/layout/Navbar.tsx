import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, LogOut, Menu, ShoppingBasket, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from '../../hooks/useCart';
import { useLogout } from '../../hooks/useAuth';
import { SmartSearchBar } from '../search/SmartSearchBar';
import { Logo } from './Logo';
import { displayName } from '../../lib/displayName';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/concerns', label: 'Shop by Concern' },
  { to: '/experts', label: 'Talk to an Expert' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
];

const ACCOUNT_LINKS = [
  { to: '/account', label: 'My account' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/consultations', label: 'Consultations' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { data: cart } = useCart();
  const logout = useLogout();
  const name = user ? displayName(user) : '';

  return (
    <header className="sticky top-0 z-40 border-b border-cream-300 bg-cream-100/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo />
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
                className="flex items-center gap-2.5 rounded-full p-1 transition hover:bg-sage-50 xl:pr-4"
                aria-label={`Account — signed in as ${name}`}
              >
                <Avatar name={name} />
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="hidden text-left leading-tight xl:block"
                >
                  <span className="block text-[11px] font-medium text-ink-600">Welcome,</span>
                  <span className="block max-w-[8.5rem] truncate font-display text-[17px] italic text-sage-900">
                    {name}
                  </span>
                </motion.span>
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
          {isAuthenticated && (
            <Link
              to="/account"
              onClick={() => setMobileOpen(false)}
              className="mb-3 flex items-center gap-3 rounded-2xl bg-sage-50 px-3 py-2.5"
            >
              <Avatar name={name} />
              <span className="leading-tight">
                <span className="block text-xs text-ink-600">Welcome,</span>
                <span className="block font-display text-lg italic text-sage-900">{name}</span>
              </span>
            </Link>
          )}
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
            {isAuthenticated ? (
              <div className="mt-2 flex flex-col gap-1 border-t border-cream-300 pt-2">
                {ACCOUNT_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-sage-50"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout.mutate();
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            ) : (
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

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sage-500 to-sage-800 font-display text-base text-cream-50 shadow-soft ring-2 ring-cream-50"
    >
      {name.charAt(0).toUpperCase()}
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-500 ring-2 ring-cream-50" />
    </span>
  );
}
