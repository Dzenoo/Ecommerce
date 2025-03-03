import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingProfileReviews: React.FC = () => {
  return (
    <div className="space-y-5 rounded-lg border p-5">
      <div className="flex flex-row items-center justify-between gap-5 max-sm:flex-col max-sm:items-start">
        <div className="flex flex-col space-y-1.5">
          <Skeleton className="h-2 w-72" />
          <Skeleton className="h-2 w-96" />
        </div>
        <Skeleton className="h-10 w-52 max-sm:w-full" />
      </div>
      <div className="flex flex-col space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton className="h-52 w-full" key={i} />
        ))}
      </div>
    </div>
  );
};

export default LoadingProfileReviews;
