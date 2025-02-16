'use client';

import React, { use } from 'react';

const ProductsPage = ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = use(params);

  return <section>ProductsPage {category}</section>;
};

export default ProductsPage;
