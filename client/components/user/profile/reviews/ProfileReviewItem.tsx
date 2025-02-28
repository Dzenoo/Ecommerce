import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IReview } from '@/types';
import { getCategory } from '@/lib/utils';
import { renderRating } from '@/helpers/render-rating';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';

type ProfileReviewItemProps = {
  review: IReview;
};

const ProfileReviewItem: React.FC<ProfileReviewItemProps> = ({ review }) => {
  const productUrl = `/products/${getCategory('id', review.product.category)?.name.toLowerCase()}/${review.product._id}`;

  return (
    <li className="space-y-5 rounded-lg border p-5">
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <div>
            <Link href={productUrl}>
              <Image
                src={review.product.images[0]}
                alt={review.product.name}
                width={80}
                height={80}
              />
            </Link>
          </div>
          <div>
            <div>
              <h1 className="font-medium">{review.product.name}</h1>
            </div>
            <div>
              <p className="truncate text-sm text-muted-foreground">
                {review.product.description}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Button asChild>
            <Link href={productUrl}>Edit Review</Link>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          {renderRating(review.product.averageRating)}
        </div>
        {review.comment && (
          <div>
            <p>{review.comment}</p>
          </div>
        )}
      </div>
    </li>
  );
};

export default ProfileReviewItem;
