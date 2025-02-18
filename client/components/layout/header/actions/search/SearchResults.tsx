import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';
import { IProduct } from '@/types';
import { renderRating } from '@/helpers/render-rating';
import Loader from '@/components/ui/info/loader';

export const SearchResults: React.FC<{}> = ({}) => {
  const searchParams = useSearchParams();

  const { data, isLoading } = useProductQuery(
    {
      type: ProductQueryType.GET_ALL,
      query: { search: searchParams.get('search') || undefined },
    },
    { enabled: !!searchParams.get('search') },
  );

  const divClasses = 'flex items-center justify-center p-5';

  if (isLoading)
    return (
      <div className={divClasses}>
        <Loader type="ScaleLoader" color="black" />
      </div>
    );

  if (!data)
    return (
      <div className={divClasses}>
        <p className="text-sm font-light text-muted-foreground">
          No products found!
        </p>
      </div>
    );

  const productsData =
    data.products.length > 5 ? data.products.slice(0, 5) : data.products;

  return (
    <div className="flex flex-col gap-5 p-5">
      {productsData.map((product: IProduct) => (
        <Link
          key={product._id}
          href={`/products/product/${product._id}`}
          className="transition-all hover:bg-[#F5F5F5]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={50}
                  height={50}
                />
              </div>
              <div>
                <h2 className="text-sm font-light">{product.name}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-1">
                  {renderRating(product.averageRating)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{product.price} DIN</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
