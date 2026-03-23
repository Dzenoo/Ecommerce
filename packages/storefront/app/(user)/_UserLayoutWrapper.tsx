'use client';

import { cn } from '@shared/lib/utils';
import { useZoomLevel } from '@shared/hooks/core/useZoomLevel.hook';

import Header from '@shared/components/layout/header/Header';

const UserLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col',
        isZoomedOut && 'm-auto max-w-screen-2xl',
      )}
    >
      <Header />
      <main className="base-padding flex-1">{children}</main>
    </div>
  );
};

export default UserLayoutWrapper;
