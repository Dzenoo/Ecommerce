'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { OrderQueryType, useOrderQuery } from '@/hooks/queries/useOrder.query';

import FilterOrdersHistory from './filters/FilterOrdersHistory';
import OrdersHistoryList from './OrdersHistoryList';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import LoadingOrdersHistory from '@/components/shared/loading/user/LoadingOrdersHistory';

const OrdersHistory: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOrdersHistory />}>
      <OrdersHistoryContent />
    </Suspense>
  );
};

const OrdersHistoryContent: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    sort: searchParams.get('sort') || 'desc',
    status: searchParams.get('status') || 'Pending',
  };

  const { data, isLoading } = useOrderQuery({
    type: OrderQueryType.GET_BY_USER,
    params: { query: query },
  });

  if (isLoading) {
    return <LoadingOrdersHistory />;
  }

  if (!data) {
    return;
  }

  const orders = data.orders;
  const totalOrders = data.totalOrders;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-medium">Your Orders ({orders.length})</h1>
      </div>
      <div>
        <FilterOrdersHistory />
      </div>
      <div>
        <OrdersHistoryList orders={orders} />
      </div>
      <div>
        {totalOrders > query.limit && (
          <QueryParamController<string> paramKey="page" defaultValue="1">
            {({ value, onChange }) => (
              <PaginateList
                onPageChange={(value) => onChange(String(value))}
                totalItems={totalOrders}
                itemsPerPage={query.limit}
                currentPage={Number(value)}
              />
            )}
          </QueryParamController>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;
