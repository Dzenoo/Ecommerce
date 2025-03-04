import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingWishlist: React.FC = () => {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-28" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-5">
        {Array.from({ length: 20 }, (_, index) => index).map((index) => (
          <Skeleton key={index} className="h-96" />
        ))}
      </div>
    </div>
  );
};

export default LoadingWishlist;
