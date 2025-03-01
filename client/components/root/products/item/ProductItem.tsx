import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IProduct } from '@/types';
import { renderRating } from '@/helpers/render-rating';
import { getCategory } from '@/lib/utils';
import MarkdownRenderer from '@/helpers/MarkdownRenderer';

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
  const category = getCategory('id', product.category);

  return (
    <li>
      <Card className="shadow-none">
        <CardHeader className="relative max-h-52 min-h-52 items-center overflow-hidden">
          <Link
            href={`/products/${category?.name.toLowerCase()}/${product._id}`}
          >
            <Image
              className="object-contain transition-all hover:scale-110"
              src={product.images[0]}
              alt={product._id}
              fill
            />
          </Link>
          <AddToFavorites
            className="absolute right-1 top-1"
            product={product}
            variant="ghost"
          />
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <Link
                href={`/products/${category?.name.toLowerCase()}/${product._id}`}
              >
                <h2 className="text-lg font-medium">{product.name}</h2>
              </Link>
            </div>
            <div className="flex items-center gap-1">
              {renderRating(product.averageRating)}
            </div>
          </div>
          <div className="mt-4 max-h-5 overflow-hidden">
            <MarkdownRenderer
              className="product-item-description-markdown"
              content={product.description}
            />
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex items-center justify-between gap-2">
          <Button type="button" variant="outline" className="flex-1">
            {product.price} $
          </Button>
          <AddToCart product={product} attributes={{}} />
        </CardFooter>
      </Card>
    </li>
  );
};

export default ProductItem;
