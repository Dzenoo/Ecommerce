import React, { use } from 'react';

const ProductDetailsPage = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);

  return <div>{productId}</div>;
};

export default ProductDetailsPage;
