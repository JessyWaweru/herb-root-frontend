import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Heart, LogOut, Menu, ShoppingBasket, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from '../../hooks/useCart';
import { useLogout } from '../../hooks/useAuth';
import { SmartSearchBar } from '../search/SmartSearchBar';
import { Logo } from './Logo';
import { displayName } from '../../lib/displayName';
import { buttonClasses } from '../ui/buttonStyles';

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
  { to: '/account/points', label: 'Garden Points' },
  { to: '/account/consultations', label: 'Consultations' },
];

const iconButton =
  'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-800 transition-colors hover:bg-sage-100 hover:text-sage-900';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { data: cart } = useCart();
  const logout = useLogout();
  const name = user ? displayName(user) : '';
  const itemCount = cart?.total_items ?? 0;

  // The header is see-through over the top of a page and turns solid once you scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The page behind the open menu shouldn't scroll.
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || mobileOpen
          ? 'border-cream-300 bg-cream-100/95 shadow-[0_12px_32px_-22px_rgba(10,56,41,0.45)] backdrop-blur-xl'
          : 'border-transparent bg-cream-100/50 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-7 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" onClick={closeMenu}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                clsx(
                  'relative whitespace-nowrap py-2 text-[13.5px] font-semibold transition-colors',
                  'after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold-500 after:transition-transform after:duration-300',
                  isActive ? 'text-sage-900 after:scale-x-100' : 'text-ink-700 after:scale-x-0 hover:text-sage-900 hover:after:scale-x-100',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <SmartSearchBar
          placeholder="Describe how you feel…"
          className="ml-auto hidden min-w-0 max-w-xs flex-1 items-center md:flex"
        />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/account/wishlist" className={iconButton} aria-label="Wishlist">
            <Heart size={19} />
          </Link>

          <Link
            to="/cart"
            className={iconButton}
            aria-label={itemCount ? `Basket, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Basket'}
          >
            <ShoppingBasket size={19} />
            {itemCount > 0 && (
              <m.span
                key={itemCount}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-900 ring-2 ring-cream-100"
              >
                {itemCount}
              </m.span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="group relative ml-1">
              <Link
                to="/account"
                className="flex items-center gap-2.5 rounded-full p-1 transition hover:bg-sage-100 xl:pr-4"
              >
                {/* On small screens the greeting is hidden, so name the link for screen readers. */}
                <span className="sr-only xl:hidden">Your account, signed in as {name}</span>
                <Avatar name={name} />
                <m.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="hidden text-left leading-tight xl:block"
                >
                  <span className="block text-[11px] font-medium text-ink-600">Welcome,</span>
                  <span className="block max-w-[8.5rem] truncate font-display text-[17px] italic text-sage-900">
                    {name}
                  </span>
                </m.span>
              </Link>
              <div className="invisible absolute right-0 top-full w-60 translate-y-1 pt-2 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-3xl border border-cream-300 bg-cream-50 p-2 shadow-lift">
                  <p className="truncate border-b border-cream-200 px-3 pb-2.5 pt-2 text-xs text-ink-600">{user?.email}</p>
                  <div className="py-1">
                    {ACCOUNT_LINKS.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-sage-100 hover:text-sage-900"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={() => logout.mutate()}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className={buttonClasses('primary', 'sm', 'ml-2 hidden sm:inline-flex')}>
              Sign in
            </Link>
          )}

          <button
            className={clsx(iconButton, 'lg:hidden')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)] overflow-y-auto border-t border-cream-300 bg-cream-100 bg-botanical px-4 pb-8 pt-5 shadow-lift lg:hidden"
          >
            <SmartSearchBar placeholder="Search, or describe how you feel…" className="mb-5 flex" onNavigate={closeMenu} />
            {isAuthenticated && (
              <Link
                to="/account"
                onClick={closeMenu}
                className="mb-4 flex items-center gap-3 rounded-3xl border border-cream-300 bg-cream-50 px-4 py-3 shadow-soft"
              >
                <Avatar name={name} />
                <span className="leading-tight">
                  <span className="block text-xs text-ink-600">Welcome,</span>
                  <span className="block font-display text-lg italic text-sage-900">{name}</span>
                </span>
              </Link>
            )}
            <nav aria-label="Main" className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <m.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * i + 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center justify-between border-b border-cream-300 py-4 font-display text-2xl',
                        isActive ? 'italic text-sage-600' : 'text-sage-900',
                      )
                    }
                  >
                    {link.label}
                    <ArrowUpRight size={20} className="text-sage-400" aria-hidden="true" />
                  </NavLink>
                </m.div>
              ))}
            </nav>
            {isAuthenticated ? (
              <div className="mt-5 flex flex-col gap-1">
                {ACCOUNT_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-sage-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    closeMenu();
                    logout.mutate();
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={closeMenu} className={buttonClasses('primary', 'lg', 'mt-6 w-full')}>
                Sign in
              </Link>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sage-600 to-sage-900 font-display text-base text-cream-50 shadow-soft ring-2 ring-cream-50"
    >
      {name.charAt(0).toUpperCase()}
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-500 ring-2 ring-cream-50" />
    </span>
  );
}
