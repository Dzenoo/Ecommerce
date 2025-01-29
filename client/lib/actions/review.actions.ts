import { CreateReviewDto, GetReviewsDto, IReview } from '@/types';

import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createReview = async (
  data: CreateReviewDto,
  productId: string,
): Promise<
  ServerResponse<{
    review: IReview;
  }>
> => {
  return await postApiHandler(`review/create/${productId}`, data);
};

export const updateReview = async (
  data: Partial<CreateReviewDto>,
  reviewId: string,
): Promise<
  ServerResponse<{
    updatedReview: IReview;
  }>
> => {
  return patchApiHandler(`review/update/${reviewId}`, data);
};

export const deleteReview = async (
  reviewId: string,
  productId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`review/delete/${reviewId}/${productId}`);
};

export const getReviews = async (
  query: GetReviewsDto,
  productId: string,
): Promise<
  ServerResponse<{
    data: {
      reviews: IReview[];
      totalReviews: number;
      skip: number;
      limit: number;
    };
  }>
> => {
  return await getApiHandler(
    `review/all/${productId}?page=${query.page}&limit=${query.limit}`,
  );
};
