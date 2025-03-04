import { Skeleton } from '@/components/ui/utilities/skeleton';

const LoadingDashboardCoupons: React.FC = () => {
  return (
    <div>
      {Array.from({ length: 15 }, (_, index) => index).map((index) => (
        <Skeleton
          key={index}
          className={`h-10 rounded-none ${index === 0 ? '' : 'mt-1'}`}
        />
      ))}
    </div>
  );
};

export default LoadingDashboardCoupons;
