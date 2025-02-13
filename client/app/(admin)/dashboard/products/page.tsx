'use client';

import { use } from 'react';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';
import { GetProductsDto } from '@/types';

import DashboardProductsList from '@/components/admin/dashboard/products/DashboardProductsList';

const DashboardProductsPage = ({ searchParams }: { searchParams: any }) => {
  const { page, limit, search, sort } = use<GetProductsDto>(searchParams);

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ALL,
    query: { page, limit, search, sort },
  });

  if (!data && !isLoading) {
    return 'No products found';
  }

  const productsData = data || {
    products: [],
    totalProducts: 0,
  };

  const totalProducts = productsData.totalProducts;

  return (
    <section>
      <DashboardProductsList productsData={productsData} />
    </section>
  );
};

export default DashboardProductsPage;
