import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
// Fonts are bundled with the site rather than loaded from Google, so visitors' IPs aren't sent there.
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/fraunces/opsz-italic.css';
import '@fontsource-variable/manrope';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './index.css';
import { queryClient } from './lib/queryClient';
import { router } from './routes/router';
import { AppToaster } from './components/ui/AppToaster';
import { fetchMe } from './lib/auth';
import { useAuthStore } from './stores/authStore';

// The stored profile only says the user *was* signed in; confirm the session cookie is
// still good (the API client refreshes it if needed, or signs the user out locally).
if (useAuthStore.getState().isAuthenticated) {
  fetchMe()
    .then((user) => useAuthStore.getState().setUser(user))
    .catch(() => undefined);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <AppToaster />
    </QueryClientProvider>
  </StrictMode>,
);
