import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingReviews: React.FC = () => {
  return (
    <div className="flex justify-between gap-5 rounded-lg border p-5">
      <div className="flex gap-4">
        <div>
          <Skeleton className="h-10 min-h-10 w-10 min-w-10 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <div className="pt-1">
              <Skeleton className="h-2 w-28" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-2 w-2 rounded-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="h-2 w-10" />
      </div>
    </div>
  );
};

export default LoadingReviews;
