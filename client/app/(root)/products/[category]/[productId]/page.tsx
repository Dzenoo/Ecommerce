import React from 'react';

import ProductDetails from '@/components/root/products/details/ProductDetails';

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  return (
    <section className="pt-5">
      <ProductDetails productId={productId} />
    </section>
  );
};

export default ProductDetailsPage;
