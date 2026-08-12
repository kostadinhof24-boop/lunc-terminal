'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import dynamic from 'next/dynamic';

const WalletProviderClient = dynamic(() => import('@/features/wallet/components/WalletProviderClient'), { ssr: false });

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProviderClient>{children}</WalletProviderClient>
    </QueryClientProvider>
  );
}