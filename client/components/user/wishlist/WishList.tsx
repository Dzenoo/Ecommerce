'use client';

import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import {
  useWishlistQuery,
  WishlistQueryType,
} from '@/hooks/queries/useWishlist.query';
import Empty from '@/helpers/Empty';
import ProductItem from '@/components/root/products/item/ProductItem';
import NotFound from '@/components/shared/NotFound';
import LoadingWishlist from '@/components/shared/loading/LoadingWishlist';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';

const WishList = () => {
  return (
    <Suspense fallback={<LoadingWishlist />}>
      <WishListContent />
    </Suspense>
  );
};

const WishListContent: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
  };

  const { data, isLoading } = useWishlistQuery({
    type: WishlistQueryType.GET_WISHLIST,
    params: { query },
  });

  if (isLoading) {
    return (
      <div className="pt-5">
        <LoadingWishlist />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-5">
        <NotFound />
      </div>
    );
  }

  const products = data.wishlist.products;

  return (
    <div className="space-y-5 pt-5">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-medium">Wishlist ({products.length})</h1>
        </div>
        {products.length === 0 && (
          <Empty
            icon={<Search size={25} className="mb-4" />}
            title="No Products In Wishlist"
            description="Your wishlist is empty. Add items to your wishlist to save them
              for later"
          />
        )}
        {products.length > 0 && (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </ul>
        )}
      </div>
      {data.totalProducts > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={data.totalProducts}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default WishList;
