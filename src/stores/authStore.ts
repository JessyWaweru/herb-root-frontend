import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

// Only the (non-secret) profile is kept in the browser; the session itself is an httpOnly cookie.
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// Earlier versions stored raw JWTs here; make sure no copy survives in anyone's browser.
try {
  localStorage.removeItem('herb-root-auth');
} catch {
  // Storage unavailable (private mode etc.) - nothing to clean up.
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (user) => set({ user, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'goherbal-auth' },
  ),
);
