'use client';

import { useZoomLevel } from '@/hooks/core/useZoomLevel.hook';

import Header from '@/components/layout/header/Header';

const RootLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isZoomedOut ? 'm-auto max-w-screen-2xl' : ''
      }`}
    >
      <Header />
      <main className="base-padding flex-1">{children}</main>
    </div>
  );
};

export default RootLayoutWrapper;
