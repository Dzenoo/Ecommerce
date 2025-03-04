'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';

import DashboardProductsList from '@/components/admin/dashboard/products/DashboardProductsList';
import PaginateList from '@/components/ui/pagination/paginate-list';
import QueryParamController from '@/components/shared/QueryParamController';
import SearchDashboardProducts from '@/components/admin/dashboard/products/filters/SearchDashboardProducts';
import LoadingDashboardProducts from '@/components/shared/loading/dashboard/LoadingDashboardProducts';
import NotFound from '@/components/shared/NotFound';

const DashboardProducts: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardProducts />}>
      <DashboardProductsContent />
    </Suspense>
  );
};

const DashboardProductsContent: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
  };

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardProducts />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalProducts = data.totalProducts;

  return (
    <div className="flex flex-col gap-5">
      <SearchDashboardProducts />

      <DashboardProductsList productsData={data} />

      {totalProducts > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalProducts}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardProducts;
