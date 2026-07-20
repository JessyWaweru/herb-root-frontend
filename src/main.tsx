import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { queryClient } from './lib/queryClient';
import { router } from './routes/router';

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
