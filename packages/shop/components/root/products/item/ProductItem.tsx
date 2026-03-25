import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';

import { IProduct } from '@shared/types';
import { renderRating } from '@shared/helpers/render-rating';
import { getCategory } from '@shared/lib/utils';
import { formatPrice } from '@shared/lib/utils/currency.utils';

import AddToFavorites from './AddToFavorites';

import { Badge } from '@shared/components/ui/info/badge';
import { Card } from '@shared/components/ui/layout/card';

type ProductItemProps = {
  product: IProduct;
};

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const category = getCategory('id', product.category);
  const discountPercent = product.discount ?? 0;
  const discountedPrice =
    Math.round(product.price * (1 - discountPercent / 100) * 100) / 100;
  const productUrl = `/products/${category?.name.toLowerCase()}/${product._id}`;
  const isOutOfStock = product.stock <= 0;
  const colors = product.attributes?.color;
  const colorList = Array.isArray(colors) ? colors.map(String) : [];

  return (
    <li className="group">
      <Card className="overflow-hidden border-0 shadow-none transition-shadow duration-300 hover:shadow-lg">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-white">
          <Link href={productUrl}>
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 25vw"
            />
          </Link>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black">
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discountPercent > 0 && !isOutOfStock && (
            <Badge
              variant="destructive"
              className="absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-xs"
            >
              -{discountPercent}%
            </Badge>
          )}

          {/* Favorites */}
          <AddToFavorites
            className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white/80 p-0 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            product={product}
            variant="ghost"
          />

          {/* Quick view on hover */}
          <Link
            href={productUrl}
            className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-black/70 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0"
          >
            <Eye size={16} />
            Quick View
          </Link>
        </div>

        {/* Content Section */}
        <div className="space-y-2 p-4">
          {/* Rating + review count */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {renderRating(product.averageRating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews?.length || 0})
            </span>
          </div>

          {/* Product name */}
          <Link href={productUrl}>
            <h2 className="mt-2 line-clamp-2 text-sm leading-tight transition-colors hover:text-primary/70">
              {product.name}
            </h2>
          </Link>

          {/* Colors */}
          {colorList.length > 0 && (
            <div className="flex items-center gap-1 pt-1">
              {colorList.slice(0, 5).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: color }}
                />
              ))}
              {colorList.length > 5 && (
                <span className="text-xs text-muted-foreground">
                  +{colorList.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold">
              {formatPrice(
                discountPercent > 0 ? discountedPrice : product.price,
              )}
            </span>
            {discountPercent > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
