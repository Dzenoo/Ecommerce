'use client';

import React from 'react';

import { useZoomLevel } from '@/hooks/core/useZoomLevel.hook';

import Header from '@/components/layout/header/Header';

const UserLayoutWrapper: React.FC<{
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
      <main className="flex-1 base-padding">{children}</main>
      <p>Footer</p>
    </div>
  );
};

export default UserLayoutWrapper;
