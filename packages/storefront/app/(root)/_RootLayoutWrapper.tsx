'use client';

import { useZoomLevel } from '@shared/hooks/core/useZoomLevel.hook';

import Header from '@shared/components/layout/header/Header';

const RootLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isZoomedOut ? 'm-auto max-w-screen-2xl' : ''
      }`}
    >
      <Header />
      <main className="base-padding flex-1 py-5">{children}</main>
    </div>
  );
};

export default RootLayoutWrapper;
