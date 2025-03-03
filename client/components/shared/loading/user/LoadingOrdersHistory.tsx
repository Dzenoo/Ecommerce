import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingOrdersHistory: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-2 w-52" />
      </div>
      <div>
        <div className="flex items-center justify-between gap-5 max-md:flex-col max-md:items-start">
          <div className="flex items-center gap-2 max-md:w-full max-md:flex-col max-md:items-start">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 max-md:w-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-28 max-md:w-full" />
        </div>
      </div>
      <div className="flex flex-col space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton className="h-72 w-full" key={i} />
        ))}
      </div>
    </div>
  );
};

export default LoadingOrdersHistory;
