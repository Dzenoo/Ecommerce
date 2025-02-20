import React from 'react';
import { Search } from 'lucide-react';

import { IProduct } from '@/types';
import ProductItem from '@/components/root/products/item/ProductItem';

type WishListProps = {
  products: IProduct[];
};

const WishList: React.FC<WishListProps> = ({ products }) => {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium">Wishlist ({products.length})</h1>
      </div>
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-6">
          <div>
            <Search size={50} className="mb-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">No Products In Wishlist</h2>
          </div>
          <div>
            <p className="text-center text-muted-foreground">
              Your wishlist is empty. Add items to your wishlist to save them
              for later
            </p>
          </div>
        </div>
      )}
      {products.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-5">
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishList;
