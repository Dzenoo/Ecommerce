'use client';

import React, { useState } from 'react';
import { Truck } from 'lucide-react';

import { IProduct } from '@/types';
import { renderRating } from '@/helpers/render-rating';
import { cn } from '@/lib/utils';

import AddToFavorites from '../item/AddToFavorites';
import AddToCart from '../item/AddToCart';
import MarkdownRenderer from '@/helpers/MarkdownRenderer';
import PickQuantity from './PickQuantity';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';

type ProductInformationProps = {
  product: IProduct;
};

const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const isOutOfStock = product.stock === 0;

  const handlePick = ({ key, value }: { key: string; value: any }) => {
    setAttributes((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="hide-scrollbar space-y-5 overflow-auto">
        <div className="flex items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-semibold capitalize">
              {product.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-4 w-4 rounded-full bg-green-500',
                isOutOfStock && 'bg-red-500',
              )}
            />
            <p className="text-sm">
              {isOutOfStock ? 'Out of' : 'On'} stock{' '}
              <span className="font-medium">({product.stock})</span>
            </p>
          </div>
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
                          key={i}
                          className={cn(
                            'capitalize',
                            Object.values(attributes).includes(v) &&
                              'border-blue-500',
                          )}
                          variant="outline"
                          onClick={() => handlePick({ key, value: v })}
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
          {!isOutOfStock && (
            <PickQuantity product={product}>
              {(quantity) => (
                <AddToCart
                  className="w-full"
                  variant="default"
                  showText
                  product={product}
                  attributes={attributes}
                  quantity={quantity}
                  disabled={isOutOfStock}
                />
              )}
            </PickQuantity>
          )}
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
