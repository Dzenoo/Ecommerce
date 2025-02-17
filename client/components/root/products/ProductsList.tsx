import React from 'react';
import { Search } from 'lucide-react';

import { IProduct } from '@/types';

import ProductItem from './item/ProductItem';

type ProductsListProps = {
  products: IProduct[];
};

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <div>
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-6">
          <div>
            <Search size={50} className="mb-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">No Products Found</h2>
          </div>
          <div>
            <p className="text-center text-muted-foreground dark:text-muted-foreground">
              Oops! It seems like there are no products found.
            </p>
          </div>
        </div>
      )}
      {products.length > 0 && (
        <ul className="grid grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
