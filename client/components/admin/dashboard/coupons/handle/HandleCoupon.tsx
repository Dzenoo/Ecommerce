import { ICoupon } from '@/types';

import HandleCouponForm from '../forms/handle-coupon/HandleCouponForm';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type HandleCouponProps =
  | {
      isEdit?: true;
      coupon: ICoupon;
    }
  | { isEdit?: false };

const HandleCoupon: React.FC<HandleCouponProps> = (props) => {
  const formProps = props.isEdit
    ? { isEdit: true as const, coupon: props.coupon }
    : { isEdit: false as const, coupon: undefined };

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>{props.isEdit ? 'Edit' : 'Create'} Coupon</CardTitle>
        <CardDescription>
          {props.isEdit
            ? 'Edit an existing coupon'
            : 'Add a new coupon to the store for discounts'}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleCouponForm {...formProps} />
      </CardContent>
    </Card>
  );
};

export default HandleCoupon;
