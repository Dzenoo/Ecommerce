import React from 'react';

// Position: Bottom-left
// Why: Identify the most popular products and focus on restocking and marketing efforts.

// X-axis: Product names
// Y-axis: Sales quantity

const SampleProducts = [
  {
    id: 1,
    items: [
      { productId: 1.1, quantity: 2 },
      { productId: 1.2, quantity: 1 },
    ],
  },
  {
    id: 2,
    items: [
      { productId: 2.1, quantity: 3 },
      { productId: 2.2, quantity: 1 },
    ],
  },
];

const TopSellingProducts: React.FC = () => {
  return <div>TopSellingProducts Bar Chart</div>;
};

export default TopSellingProducts;
