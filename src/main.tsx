import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { queryClient } from './lib/queryClient';
import { router } from './routes/router';
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
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#3f5d3a',
            color: '#fbf7ee',
            borderRadius: '9999px',
            fontSize: '14px',
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
