import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingDashboardOrders: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-5 max-lg:flex-col">
        <div className="flex-1 basis-full"></div>
        <div className="flex items-center gap-2 max-lg:flex-col">
          <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
            <Skeleton className="h-10 w-40 max-lg:w-full" />
          </div>
          <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
            <Skeleton className="h-10 w-40 max-lg:w-full" />
          </div>
          <div className="flex-1 basis-1/12 max-lg:w-full max-lg:basis-full">
            <Skeleton className="h-10 w-40 max-lg:w-full" />
          </div>
        </div>
      </div>
      <div>
        {Array.from({ length: 15 }, (_, index) => index).map((index) => (
          <Skeleton
            key={index}
            className={`h-10 rounded-none ${index === 0 ? '' : 'mt-1'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingDashboardOrders;
