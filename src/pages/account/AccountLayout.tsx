import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Heart, MapPin, Package, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCurrentUser } from '../../hooks/useAuth';
import { Badge } from '../../components/ui/Badge';

const LINKS = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin, end: false },
  { to: '/account/orders', label: 'Orders', icon: Package, end: false },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, end: false },
];

export function AccountLayout() {
  useCurrentUser();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-sage-900">My account</h1>
        {user && (
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-600">
            <span>{user.email}</span>
            {!user.is_email_verified && <Badge tone="gold">Email not verified</Badge>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <nav className="flex gap-2 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                  isActive ? 'bg-sage-600 text-cream-50' : 'text-ink-700 hover:bg-sage-100',
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
