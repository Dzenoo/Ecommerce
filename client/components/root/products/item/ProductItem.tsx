import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IProduct } from '@/types';
import { renderRating } from '@/helpers/render-rating';

import AddToCart from './AddToCart';
import AddToFavorites from './AddToFavorites';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/layout/card';

type ProductItemProps = {
  product: IProduct;
};

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <li>
      <Card className="shadow-none">
        <CardHeader className="relative items-center">
          <Link href={`/products/product/${product._id}`}>
            <Image
              className="transition-all hover:scale-110"
              src={product.images[0]}
              alt={product._id}
              width={500}
              height={500}
            />
          </Link>
          <AddToFavorites
            className="absolute right-2 top-2"
            product={product}
          />
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <Link href={`/products/product/${product._id}`}>
                <h2 className="text-lg font-medium">{product.name}</h2>
              </Link>
            </div>
            <div className="flex items-center gap-1">
              {renderRating(product.averageRating)}
            </div>
          </div>
          <div className="mt-4">
            <p className="truncate text-sm font-light text-muted-foreground">
              {product.description}
            </p>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex items-center justify-between gap-2">
          <Button type="button" variant="outline" className="flex-1">
            {product.price} DIN
          </Button>
          <AddToCart product={product} />
        </CardFooter>
      </Card>
    </li>
  );
};

export default ProductItem;
