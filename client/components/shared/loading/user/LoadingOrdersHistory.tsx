import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingOrdersHistory: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-2 w-52" />
      </div>
      <div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-10 w-28" />
              </div>
            ))}
          </div>
          <div>
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton className="h-72 w-full" />
        ))}
      </div>
    </div>
  );
};

export default LoadingOrdersHistory;
