export type CreateReviewDto = {
  rating: number;
  comment: string;
};

export type GetReviewsDto = {
  page?: number;
  limit?: number;
};
