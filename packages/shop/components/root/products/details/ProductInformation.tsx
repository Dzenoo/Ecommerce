'use client';

import React, { useState } from 'react';
import { Truck } from 'lucide-react';

import { IProduct } from '@shared/types';
import { renderRating } from '@shared/helpers/render-rating';
import { cn } from '@shared/lib/utils';
import { formatPrice } from '@shared/lib/utils/currency.utils';

import AddToFavorites from '../item/AddToFavorites';
import AddToCart from '../item/AddToCart';
import MarkdownRenderer from '@shared/helpers/MarkdownRenderer';
import PickQuantity from './PickQuantity';

import { Button } from '@shared/components/ui/buttons/button';
import { Separator } from '@shared/components/ui/layout/separator';

type ProductInformationProps = {
  product: IProduct;
};

const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const isOutOfStock = product.stock === 0;
  const discountPercent = product.discount ?? 0;
  const discountedPrice =
    Math.round(product.price * (1 - discountPercent / 100) * 100) / 100;

  const handlePick = ({ key, value }: { key: string; value: any }) => {
    setAttributes((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const scrollToReviews = () => {
    const element = document.getElementById('reviews') as HTMLElement;
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-2 gap-10 max-md:grid-cols-1">
      <div className="hide-scrollbar space-y-5 overflow-auto">
        <div className="flex flex-wrap items-center justify-between gap-5">
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

        <button onClick={scrollToReviews} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderRating(product.averageRating)}
            </div>
            <div className="mt-0.5">
              <p className="text-sm font-medium">{product.reviews.length}</p>
            </div>
          </div>
        </button>

        <div>
          {discountPercent > 0 ? (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-xl font-semibold">
                {formatPrice(discountedPrice)}
              </p>
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </p>
            </div>
          ) : (
            <p className="text-xl font-semibold">
              {formatPrice(product.price)}
            </p>
          )}
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
                    <div className="flex flex-wrap items-center gap-2">
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
            <PickQuantity product={product} className="w-full">
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

      <div className="space-y-5">
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
            Delivery for 1-3 working days, price for delivery {formatPrice(5)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
