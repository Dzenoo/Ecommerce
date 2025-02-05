'use client';

import React from 'react';

import { useZoomLevel } from '@/hooks/core/useZoomLevel.hook';

import NavActions from '@/components/layout/header/actions/NavActions';

const AdminLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isZoomedOut ? 'm-auto max-w-screen-2xl' : ''
      }`}
    >
      <NavActions showSearch={false} />
      <main className="base-padding flex-1 py-5">{children}</main>
    </div>
  );
};

export default AdminLayoutWrapper;
