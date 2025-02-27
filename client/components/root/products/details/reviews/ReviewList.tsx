import React from 'react';
import { MessageCircle } from 'lucide-react';

import { IReview } from '@/types';
import Empty from '@/helpers/Empty';
import ReviewItem from './ReviewItem';

type ReviewListProps = {
  reviews: IReview[];
};

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <Empty
        icon={<MessageCircle size={25} className="mb-4" />}
        title="No Reviews Found"
        description="There is no reviews for this product."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {reviews.map((review) => (
        <ReviewItem
          key={review._id}
          productId={review.product}
          review={review}
        />
      ))}
    </ul>
  );
};

export default ReviewList;
