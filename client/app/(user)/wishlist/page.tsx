'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

import {
  useWishlistQuery,
  WishlistQueryType,
} from '@/hooks/queries/useWishlist.query';
import WishList from '@/components/user/wishlist/WishList';
import NotFound from '@/components/shared/NotFound';
import LoadingWishlist from '@/components/shared/loading/LoadingWishlist';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';

const WishlistPage = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
  };

  const { data, isLoading } = useWishlistQuery({
    type: WishlistQueryType.GET_WISHLIST,
    query,
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

  return (
    <section className="space-y-5 pt-5">
      <WishList products={data.wishlist.products} />

      {data.totalProducts > 10 && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={data.totalProducts}
              itemsPerPage={10}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </section>
  );
};

export default WishlistPage;
