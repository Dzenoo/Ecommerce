'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

import { setTokenProvider } from '../../lib/api';

export function ClerkTokenProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenProvider(() => getToken());
  }, [getToken]);

  return <>{children}</>;
}
