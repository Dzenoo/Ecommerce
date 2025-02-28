'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import { OrderQueryType, useOrderQuery } from '@/hooks/queries/useOrder.query';
import OrdersHistory from '@/components/user/profile/orders/OrdersHistory';

const OrdersHistoryPage = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    sort: searchParams.get('sort') || 'desc',
    status: searchParams.get('status') || 'Pending',
  };

  const { data, isLoading } = useOrderQuery({
    type: OrderQueryType.GET_BY_USER,
    params: { query: query },
  });

  if (isLoading) {
    return 'Loading.....';
  }

  if (!data) {
    return;
  }

  return (
    <section>
      <OrdersHistory data={data} />
    </section>
  );
};

export default OrdersHistoryPage;
