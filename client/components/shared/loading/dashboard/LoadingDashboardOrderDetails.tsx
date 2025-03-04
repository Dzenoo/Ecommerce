import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingDashboardOrderDetails: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <Skeleton className="h-2 w-72 max-sm:w-28" />
        <Skeleton className="h-2 w-96 max-sm:w-28" />
        <Skeleton className="h-2 w-52 max-sm:w-28" />
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-5 max-xl:grid-cols-2 max-lg:grid-cols-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2 max-md:flex-col">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-2 w-52" />
                <Skeleton className="h-2 w-52" />
                <Skeleton className="h-2 w-52" />
                <Skeleton className="h-2 w-52" />
              </div>
            </div>
          ))}
        </div>
        <div>
          {Array.from({ length: 8 }, (_, index) => index).map((index) => (
            <Skeleton
              key={index}
              className={`h-10 rounded-none ${index === 0 ? '' : 'mt-1'}`}
            />
          ))}
        </div>
        <div className="flex items-end justify-end">
          <div className="space-y-1">
            <Skeleton className="h-2 w-52" />
            <Skeleton className="h-2 w-52" />
            <Skeleton className="h-2 w-52" />
            <Skeleton className="h-2 w-52" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingDashboardOrderDetails;
