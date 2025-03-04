'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { GetProductsDto } from '@/types';
import { getCategory } from '@/lib/utils';
import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';
import { useQueryParams } from '@/hooks/core/useQueryParams';

import NotFound from '@/components/shared/NotFound';
import ProductsList from '@/components/root/products/ProductsList';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import FilterProducts from '@/components/root/products/filters/FilterProducts';
import LoadingProducts from '@/components/shared/loading/products/LoadingProducts';
import BreadcrumbProducts from '@/components/root/products/BreadcrumbProducts';
import SortProducts from '@/components/root/products/filters/SortProducts';

import { Button } from '@/components/ui/buttons/button';

type ProductsProps = {
  category: string;
};

const Products: React.FC<ProductsProps> = ({ category }) => {
  return (
    <Suspense fallback={<LoadingProducts />}>
      <ProductsContent category={category} />
    </Suspense>
  );
};

const ProductsContent: React.FC<ProductsProps> = ({ category }) => {
  const { clearAllQueryParams } = useQueryParams();
  const searchParams = useSearchParams();

  const selectedCategory = getCategory('name', category);

  const query: GetProductsDto = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    category: selectedCategory?.id,
    attributes: {},
  };

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin || priceMax) {
    query.price = {
      min: priceMin ? Number(priceMin) : 0,
      max: priceMax ? Number(priceMax) : 100000,
    };
  }

  selectedCategory?.fields?.forEach((field) => {
    const values = searchParams.getAll(field.name);
    if (values.length > 0) {
      if (query.attributes) {
        query.attributes[field.name] = values;
      }
    }
  });

  const { data, isLoading } = useProductQuery(
    {
      type: ProductQueryType.GET_ALL,
      params: { query },
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  if (!selectedCategory) return <NotFound />;
  if (isLoading) return <LoadingProducts />;
  if (!data) return <NotFound />;

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-10 max-lg:grid-cols-1">
      <div className="space-y-5">
        <BreadcrumbProducts page={selectedCategory.name} />
        <FilterProducts selectedCategory={selectedCategory} />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2 max-md:flex-col max-md:items-start">
          <div className="basis-full">
            <h1 className="text-xl font-bold">{selectedCategory.name}</h1>
          </div>
          <Button
            variant="outline"
            onClick={clearAllQueryParams}
            className="max-md:w-full"
          >
            Clear All Filters
          </Button>
          <SortProducts />
        </div>

        <ProductsList products={data.products} />

        {data.totalProducts > (query.limit ?? 10) && (
          <QueryParamController<string> paramKey="page" defaultValue="1">
            {({ value, onChange }) => (
              <PaginateList
                onPageChange={(value) => onChange(String(value))}
                totalItems={data.totalProducts}
                itemsPerPage={query.limit ?? 10}
                currentPage={Number(value)}
              />
            )}
          </QueryParamController>
        )}
      </div>
    </div>
  );
};

export default Products;
