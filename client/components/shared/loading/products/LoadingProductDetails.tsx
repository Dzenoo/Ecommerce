import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';
import { Separator } from '@/components/ui/layout/separator';

const LoadingProductDetails: React.FC = () => {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-10 pt-5 max-xl:grid-cols-1 max-sm:gap-20">
      <div className="space-y-10">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-[500px]" />
        <div className="flex gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-28" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
        <div className="space-y-5">
          <div className="flex justify-between gap-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
          <Separator />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-40" />
          ))}
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingProductDetails;
