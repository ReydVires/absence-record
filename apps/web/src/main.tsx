import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

import type { AxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2min
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, err) => {
        const error = err as AxiosError;
        if (failureCount >= 3) return false;

        // Skip retries for specific status codes
        const status = error?.response?.status ?? -1;
        const nonRecoverableCodes = [401, 403, 404, 422];

        if (nonRecoverableCodes.includes(status)) {
          console.log(`Skipping retry for status: ${status}`);
          return false;
        }

        return true;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
