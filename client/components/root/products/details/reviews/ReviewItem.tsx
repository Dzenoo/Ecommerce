import React from 'react';
import Image from 'next/image';

import { IReview } from '@/types';
import { renderRating } from '@/helpers/render-rating';
import { formatDate } from '@/lib/utils';

type ReviewItemProps = {
  review: IReview;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <li className="flex justify-between gap-5 rounded-lg border p-5">
      <div className="flex gap-4">
        <div>
          <Image
            className="h-10 min-h-10 w-10 min-w-10 rounded-full object-cover"
            src="/images/avatar.jpg"
            alt="user-avatar"
            width={50}
            height={50}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <div className="pt-1">
              <h1 className="font-medium">
                {review.user.first_name} {review.user.last_name}
              </h1>
            </div>
            <div className="flex items-center gap-1">
              {renderRating(review.rating)}
            </div>
          </div>
          {review.comment && (
            <div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <span className="whitespace-nowrap text-base text-muted-foreground">
          {formatDate(review.createdAt)}
        </span>
      </div>
    </li>
  );
};

export default ReviewItem;
