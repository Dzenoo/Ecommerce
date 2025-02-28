import React from 'react';

import { IOrder } from '@/types';

import FilterOrdersHistory from './filters/FilterOrdersHistory';
import OrdersHistoryList from './OrdersHistoryList';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';

type OrdersHistoryProps = {
  data: {
    orders: IOrder[];
    totalOrders: number;
  };
};

const OrdersHistory: React.FC<OrdersHistoryProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-medium">
          Your Orders ({data.orders.length})
        </h1>
      </div>
      <div>
        <FilterOrdersHistory />
      </div>
      <div>
        <OrdersHistoryList orders={data.orders} />
      </div>
      <div>
        {data.totalOrders > 10 && (
          <QueryParamController<string> paramKey="page" defaultValue="1">
            {({ value, onChange }) => (
              <PaginateList
                onPageChange={(value) => onChange(String(value))}
                totalItems={data.totalOrders}
                itemsPerPage={10}
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
