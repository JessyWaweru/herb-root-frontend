import type { User } from '../types';

export function displayName(user: Pick<User, 'first_name' | 'email'>) {
  return user.first_name.trim() || user.email.split('@')[0];
}
