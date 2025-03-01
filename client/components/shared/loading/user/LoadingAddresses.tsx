import { Skeleton } from '@/components/ui/utilities/skeleton';
import React from 'react';

const LoadingAddresses: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-5">
        <div className="space-y-2">
          <Skeleton className="h-2 w-72" />
          <Skeleton className="h-2 w-96" />
        </div>
        <div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton className="h-72 w-full" key={i} />
        ))}
      </div>
    </div>
  );
};

export default LoadingAddresses;
