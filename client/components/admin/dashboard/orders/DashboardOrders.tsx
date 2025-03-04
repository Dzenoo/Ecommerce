'use client';

import { useSearchParams } from 'next/navigation';

import { OrderQueryType, useOrderQuery } from '@/hooks/queries/useOrder.query';

import FilterDashboardOrders from './filters/FilterDashboardOrders';
import DashboardOrdersList from './DashboardOrdersList';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import NotFound from '@/components/shared/NotFound';
import LoadingDashboardOrders from '@/components/shared/loading/dashboard/LoadingDashboardOrders';

const DashboardOrders: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || '',
  };

  const { data, isLoading } = useOrderQuery({
    type: OrderQueryType.GET_ALL,
    params: {
      query,
    },
  });

  if (isLoading) {
    return <LoadingDashboardOrders />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalOrders = data.totalOrders;

  return (
    <div className="flex flex-col gap-5">
      <FilterDashboardOrders />

      <DashboardOrdersList ordersData={data} />

      {totalOrders > 10 && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalOrders}
              itemsPerPage={10}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardOrders;
