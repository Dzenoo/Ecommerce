import React from 'react';

// Position: Top-right
// Why: Quickly visualize the distribution of orders (Pending, Shipped, Delivered, Cancelled) to manage fulfillment performance.

const SampleOrders = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'completed' },
  { id: 3, status: 'shipped' },
  { id: 4, status: 'cancelled' },
];

const OrdersByStatus: React.FC = () => {
  return <div>OrdersByStatus Donut Chart</div>;
};

export default OrdersByStatus;
