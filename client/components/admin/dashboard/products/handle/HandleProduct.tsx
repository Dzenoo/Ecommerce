import HandleProductForm from '../forms/handle-product/HandleProductForm';

import { IProduct } from '@/types';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

type HandleProductProps =
  | {
      isEdit?: true;
      product: IProduct;
    }
  | { isEdit?: false };

const HandleProduct: React.FC<HandleProductProps> = (props) => {
  const formProps = props.isEdit
    ? { isEdit: true as const, product: props.product }
    : { isEdit: false as const, product: undefined };

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>{props.isEdit ? 'Edit' : 'Add'} Product</CardTitle>
        <CardDescription>
          {props.isEdit
            ? 'Edit an existing product'
            : 'Add a new product to the store'}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleProductForm {...formProps} />
      </CardContent>
    </Card>
  );
};

export default HandleProduct;
