"use client";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../lib/api/react-query';
import { ReactNode } from 'react';

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
