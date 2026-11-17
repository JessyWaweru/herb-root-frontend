import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Heart, LogOut, MapPin, Package, Sprout, Stethoscope, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCurrentUser, useLogout } from '../../hooks/useAuth';
import { Badge } from '../../components/ui/Badge';
import { Eyebrow } from '../../components/ui/SectionHeading';
import { Sprig } from '../../components/art/Botanical';
import { displayName } from '../../lib/displayName';

const LINKS = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin, end: false },
  { to: '/account/orders', label: 'Orders', icon: Package, end: false },
  { to: '/account/points', label: 'Points', icon: Sprout, end: false },
  { to: '/account/consultations', label: 'Consultations', icon: Stethoscope, end: false },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, end: false },
];

export function AccountLayout() {
  useCurrentUser();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div>
      <section className="bg-botanical relative -mt-[4.5rem] overflow-hidden border-b border-cream-300 pt-[4.5rem]">
        <Sprig className="pointer-events-none absolute -right-6 -top-6 hidden h-72 rotate-[24deg] text-sage-300/60 md:block" leaves={7} />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <Eyebrow>My account</Eyebrow>
          <h1 className="mt-4 font-display text-4xl leading-tight tracking-[-0.02em] text-sage-900 sm:text-5xl">
            {user ? (
              <>
                Hello, <em className="accent-italic">{displayName(user)}</em>
              </>
            ) : (
              'My account'
            )}
          </h1>
          {user && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-600">
              <span>{user.email}</span>
              {!user.is_email_verified && <Badge tone="gold">Email not verified</Badge>}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">
        <nav
          aria-label="Account"
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:card lg:sticky lg:top-28 lg:mx-0 lg:h-fit lg:w-60 lg:shrink-0 lg:flex-col lg:gap-1 lg:p-3"
        >
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 lg:rounded-2xl',
                  isActive
                    ? 'bg-sage-800 text-cream-50 shadow-press [&_svg]:text-gold-400'
                    : 'border border-cream-300 bg-cream-50 text-ink-700 hover:bg-sage-100 hover:text-sage-900 lg:border-0 lg:bg-transparent',
                )
              }
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => logout.mutate()}
            className="flex shrink-0 items-center gap-3 rounded-full border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 lg:mt-2 lg:rounded-2xl lg:border-0 lg:border-t lg:border-cream-200 lg:bg-transparent"
          >
            <LogOut size={17} aria-hidden="true" />
            Sign out
          </button>
        </nav>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
