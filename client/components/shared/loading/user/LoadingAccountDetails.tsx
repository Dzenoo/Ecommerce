import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingAccountDetails = () => {
  return (
    <div className="flex justify-between gap-10 max-lg:flex-col">
      <div className="flex items-center gap-5">
        <Skeleton className="h-36 w-36 rounded-full" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-2 w-28" />
            <Skeleton className="h-2 w-52" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2 w-28" />
            <Skeleton className="h-2 w-52" />
          </div>
        </div>
      </div>
      <div className="flex gap-5 whitespace-nowrap max-sm:flex-col">
        <Skeleton className="h-2 w-28" />
        <Skeleton className="h-2 w-28" />
        <Skeleton className="h-2 w-28" />
      </div>
    </div>
  );
};

export default LoadingAccountDetails;
