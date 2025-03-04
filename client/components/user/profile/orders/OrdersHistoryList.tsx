import { ClipboardList } from 'lucide-react';

import { IOrder } from '@/types';

import OrdersHistoryItem from './OrdersHistoryItem';
import Empty from '@/helpers/Empty';

type OrdersHistoryList = {
  orders: IOrder[];
};

const OrdersHistoryList: React.FC<OrdersHistoryList> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <Empty
        icon={<ClipboardList size={25} className="mb-4" />}
        title="No Orders Found"
        description="Your orders will be displayed here"
      />
    );
  }

  return (
    <ul className="flex flex-col space-y-5">
      {orders.map((order) => (
        <OrdersHistoryItem key={order._id} order={order} />
      ))}
    </ul>
  );
};

export default OrdersHistoryList;
