import { MessageCircle } from 'lucide-react';

import { IReview } from '@shared/types';
import ProfileReviewItem from './ProfileReviewItem';
import Empty from '@shared/helpers/Empty';

type ProfileReviewListProps = {
  reviews: IReview[];
};

const ProfileReviewList: React.FC<ProfileReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0)
    return (
      <Empty
        icon={<MessageCircle size={25} className="mb-4" />}
        title="No Reviews Found"
        description="All your reviews for product will be shown here"
      />
    );

  return (
    <ul className="flex flex-col space-y-5">
      {reviews.map((review) => (
        <ProfileReviewItem key={review._id} review={review} />
      ))}
    </ul>
  );
};

export default ProfileReviewList;
