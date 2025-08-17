"use client";
import { ReactNode } from 'react';

export function Loading({ children, isLoading }: { children: ReactNode; isLoading: boolean }) {
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  return <>{children}</>;
}
