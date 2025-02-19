import React from 'react';

import { IProduct } from '@/types';
import { renderRating } from '@/helpers/render-rating';
import AddToFavorites from '../item/AddToFavorites';
import AddToCart from '../item/AddToCart';
import MarkdownRenderer from '@/helpers/MarkdownRenderer';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import { Truck } from 'lucide-react';

type ProductInformationProps = {
  product: IProduct;
};

const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-semibold capitalize">
              {product.name}
            </h1>
          </div>
          {product.stock > 0 && (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-green-500" />
              <p className="text-sm">On stock</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderRating(product.averageRating)}
          </div>
          <div className="mt-0.5">
            <p className="text-sm font-medium">{product.reviews.length}</p>
          </div>
        </div>

        <div>
          <p className="text-xl font-semibold">{product.price} DIN</p>
        </div>

        <Separator />

        <div className="space-y-8">
          {Object.entries(product.attributes).map(([key, value]) => {
            return (
              <div key={key} className="space-y-2">
                <label className="text-base font-medium capitalize">
                  {key}
                </label>
                <div className="text-sm capitalize">
                  {value instanceof Array ? (
                    <div className="flex items-center gap-2">
                      {value.map((v, i) => (
                        <Button
                          className="capitalize"
                          variant="outline"
                          key={i}
                        >
                          {v}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <AddToCart variant="default" showText product={product} />
          <AddToFavorites variant="outline" showText product={product} />
        </div>
      </div>

      <div className="space-y-10">
        <div className="space-y-2">
          <label className="text-base font-medium">Description</label>
          <MarkdownRenderer
            className="product-details-description-markdown"
            content={product.description}
          />
        </div>

        <div className="flex w-fit items-center gap-5 rounded-md border bg-white p-5">
          <Truck />{' '}
          <p className="text-sm">
            Isporuka za 1-3 radna dana, cena dostave 360 RSD
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
