'use client';

import { useZoomLevel } from '@/hooks/core/useZoomLevel.hook';

const AuthLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <main className={`${isZoomedOut ? 'm-auto max-w-screen-2xl' : ''}`}>
      {children}
    </main>
  );
};

export default AuthLayoutWrapper;
