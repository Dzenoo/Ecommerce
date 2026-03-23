'use client';

import { cn } from '@shared/lib/utils';
import { useZoomLevel } from '@shared/hooks/core/useZoomLevel.hook';

const AuthLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <div
      className={cn(
        'flex h-screen flex-col items-center justify-center gap-10 py-10',
        isZoomedOut && 'm-auto max-w-screen-2xl',
      )}
    >
      <main>{children}</main>
    </div>
  );
};

export default AuthLayoutWrapper;
