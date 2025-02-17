import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

import { IProduct } from '@/types';

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
          <Image
            src={product.images[0]}
            alt={product._id}
            width={500}
            height={500}
          />
          <AddToFavorites
            className="absolute right-2 top-2"
            product={product}
          />
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex justify-between gap-5">
            <div>
              <h2 className="text-lg font-medium">{product.name}</h2>
            </div>
            <div className="flex items-center gap-1">
              <span className="mt-0.5 font-bold">{product.averageRating}</span>{' '}
              <Star color="#FFAE00" />
            </div>
          </div>
          <div className="mt-2">
            <p className="truncate font-light text-muted-foreground">
              {product.description}
            </p>
          </div>
        </CardContent>
        <Separator />
        <CardFooter>
          <div className="grid w-full grid-cols-2 gap-5">
            <Button type="button" variant="outline">
              {product.price} DIN
            </Button>
            <AddToCart product={product} />
          </div>
        </CardFooter>
      </Card>
    </li>
  );
};

export default ProductItem;
