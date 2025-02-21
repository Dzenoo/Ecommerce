import React from 'react';
import { Search } from 'lucide-react';

import { IProduct } from '@/types';
import Empty from '@/helpers/Empty';

import ProductItem from './item/ProductItem';

type ProductsListProps = {
  products: IProduct[];
};

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <div>
      {products.length === 0 && (
        <Empty
          icon={<Search size={25} className="mb-4" />}
          title="No Products Found"
          description="Oops! It seems like there are no products found."
        />
      )}
      {products.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
