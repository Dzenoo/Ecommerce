import React from 'react';

import { IReview } from '@/types';
import ProfileReviewItem from './ProfileReviewItem';

type ProfileReviewListProps = {
  reviews: IReview[];
};

const ProfileReviewList: React.FC<ProfileReviewListProps> = ({ reviews }) => {
  return (
    <ul className="flex flex-col space-y-5">
      {reviews.map((review) => (
        <ProfileReviewItem key={review._id} review={review} />
      ))}
    </ul>
  );
};

export default ProfileReviewList;
