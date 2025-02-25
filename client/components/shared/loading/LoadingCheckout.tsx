import React from 'react';

import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingCheckout: React.FC = () => {
  return (
    <div className="grid grid-cols-[2.5fr,1fr] gap-5 pt-5">
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  );
};

export default LoadingCheckout;
