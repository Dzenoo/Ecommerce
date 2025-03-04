import React, { useState } from 'react';
import Image from 'next/image';
import { Delete, Edit } from 'lucide-react';

import { IReview } from '@/types';
import { renderRating } from '@/helpers/render-rating';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import {
  ReviewMutationType,
  useReviewMutation,
} from '@/hooks/mutations/useReview.mutation';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';
import { ProductQueryType } from '@/hooks/queries/useProduct.query';
import { ReviewQueryType } from '@/hooks/queries/useReview.query';
import ReviewForm from './forms/ReviewForm';

import { Button } from '@/components/ui/buttons/button';

type ReviewItemProps = {
  review: IReview;
  productId: string;
};

const ReviewItem: React.FC<ReviewItemProps> = ({ review, productId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const mutation = useReviewMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [
          'products',
          {
            type: ProductQueryType.GET_ONE,
            params: { productId },
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'reviews',
          {
            type: ReviewQueryType.GET_ALL,
            params: { productId },
          },
        ],
      });

      toast({
        title: 'Success',
        description: response.message,
      });
    },
  });

  const handleDelete = () => {
    mutation.mutateAsync({
      type: ReviewMutationType.DELETE,
      productId,
      reviewId: review._id,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const isOwner = user?.userId === review.user._id;
  const isAdmin = user?.role === 'admin';

  if (isEditing) {
    return (
      <li className="rounded-lg border p-5">
        <ReviewForm
          productId={productId}
          reviewToEdit={review}
          onCancel={handleCancelEdit}
        />
      </li>
    );
  }

  return (
    <li
      id={review._id}
      className="hide-scrollbar flex justify-between gap-5 overflow-x-scroll whitespace-nowrap rounded-lg border p-5"
    >
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
        <div>
          <div className="flex gap-2">
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
      <div className="space-y-1">
        {isOwner && !isAdmin && (
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={handleEdit}>
              <Edit />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete}>
              <Delete />
            </Button>
          </div>
        )}
        <div>
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>
    </li>
  );
};

export default ReviewItem;
