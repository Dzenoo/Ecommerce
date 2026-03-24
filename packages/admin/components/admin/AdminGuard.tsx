'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { useCurrentUser } from '@shared/hooks/useCurrentUser';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      signOut().then(() => router.replace('/sign-in'));
    }
  }, [user, isLoading, signOut, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
