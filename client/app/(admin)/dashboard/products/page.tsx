'use client';

import { useSearchParams } from 'next/navigation';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';

import DashboardProductsList from '@/components/admin/dashboard/products/DashboardProductsList';
import PaginateList from '@/components/ui/pagination/paginate-list';
import QueryParamController from '@/components/shared/QueryParamController';
import SearchDashboardProducts from '@/components/admin/dashboard/products/filters/SearchDashboardProducts';
import LoadingDashboardProducts from '@/components/shared/loading/LoadingDashboardProducts';
import NotFound from '@/components/shared/NotFound';

const DashboardProductsPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ALL,
    params: { page, limit, search, sort },
  });

  if (isLoading) {
    return <LoadingDashboardProducts />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalProducts = data.totalProducts;

  return (
    <section className="flex flex-col gap-5">
      <SearchDashboardProducts />

      <DashboardProductsList productsData={data} />

      {totalProducts > 10 && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalProducts}
              itemsPerPage={10}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </section>
  );
};

export default DashboardProductsPage;
