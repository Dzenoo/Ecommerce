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
      className={`flex min-h-screen flex-col ${
        isZoomedOut ? 'm-auto max-w-screen-2xl' : ''
      }`}
    >
      <Header />
      <main className="base-padding flex-1">{children}</main>
    </div>
  );
};

export default UserLayoutWrapper;
