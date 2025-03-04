import Link from 'next/link';
import Image from 'next/image';

import { IOrder } from '@/types';
import FieldGroup from '@/helpers/FieldGroup';
import { formatDate, getCategory } from '@/lib/utils';
import {
  OrderMutationType,
  useOrderMutation,
} from '@/hooks/mutations/useOrder.mutation';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';
import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/layout/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/layout/alert-dialog';

type OrdersHistoryItemProps = {
  order: IOrder;
};

const OrdersHistoryItem: React.FC<OrdersHistoryItemProps> = ({ order }) => {
  const { toast } = useToast();

  const mutation = useOrderMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      toast({
        title: 'Success',
        description: response.message,
      });
    },
  });

  const customStyles = {
    h1: 'font-medium text-muted-foreground text-sm',
    p: 'font-medium text-black',
  };

  const Header = [
    {
      id: 1,
      title: 'Order Placed',
      value: formatDate(order.createdAt),
      customStyles,
    },
    {
      id: 2,
      title: 'Total',
      value: order.totalPrice + ' $',
      customStyles,
    },
    {
      id: 3,
      title: 'Ship To',
      value: order.user.first_name + ` ${order.user.last_name}`,
      customStyles,
    },
  ];

  const isCancelled = order.status === 'Cancelled';

  const handleCancelOrder = () => {
    if (isCancelled) return;

    return mutation.mutateAsync({
      type: OrderMutationType.CANCEL,
      orderId: order._id,
    });
  };

  return (
    <li>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-5 max-lg:flex-col">
          <div className="flex flex-row items-start gap-20 space-y-0 max-sm:flex-col max-sm:gap-5">
            {Header.map((h) => (
              <FieldGroup
                key={h.id}
                title={h.title}
                value={h.value}
                customStyles={h.customStyles}
              />
            ))}
          </div>
          <div className="space-y-2">
            <FieldGroup
              title="Order"
              value={order._id}
              customStyles={{
                div: 'flex flex-row',
              }}
            />
            {!isCancelled && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="px-0">
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure to cancel this order?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will change order status to cancelled and order will
                      not be shipped
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={handleCancelOrder}>
                      {mutation.status === 'pending' ? (
                        <Loader type="ScaleLoader" height={10} />
                      ) : (
                        'Confirm'
                      )}
                    </AlertDialogAction>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {order.items.map((item, i) => (
            <div
              key={i}
              className="hide-scrollbar flex gap-5 max-sm:overflow-x-scroll"
            >
              <div>
                <Image
                  className="min-h-28 w-fit min-w-28 rounded-lg border"
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={150}
                  height={150}
                />
              </div>
              <div className="space-y-4">
                <div className="flex gap-10">
                  <div>
                    <FieldGroup
                      title="Product Name"
                      value={item.product.name}
                      customStyles={customStyles}
                    />
                  </div>
                  <div>
                    <FieldGroup
                      title="Product Price"
                      value={item.product.price + ' $'}
                      customStyles={customStyles}
                    />
                  </div>
                </div>
                <div>
                  <Button asChild>
                    <Link
                      href={`/products/${getCategory('id', item.product.category)?.name.toLowerCase()}/${item.product._id}`}
                    >
                      Buy it again
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </li>
  );
};

export default OrdersHistoryItem;
