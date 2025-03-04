import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-md:grid-cols-1">
        {Array.from({ length: 4 }, (_, index) => index).map((index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        {Array.from({ length: 4 }, (_, index) => index).map((index) => (
          <Skeleton key={index} className="h-96" />
        ))}
      </div>
    </div>
  );
};

export default LoadingDashboard;
