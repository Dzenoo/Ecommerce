import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, View } from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';
import { IOrder } from '@/types';
import {
  OrderMutationType,
  useOrderMutation,
} from '@/hooks/mutations/useOrder.mutation';
import { useToast } from '@/hooks/core/use-toast';
import { queryClient } from '@/context/react-query-client';

import { Button } from '@/components/ui/buttons/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/utilities/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/layout/dropdown-menu';

type OrderStatus = IOrder['status'];

const OrdersColors: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-500',
  Delivered: 'bg-green-500',
  Shipped: 'bg-blue-500',
  Processing: 'bg-orange-500',
  Cancelled: 'bg-red-500',
};

type DashboardOrdersListProps = {
  ordersData: { orders: IOrder[]; totalOrders: number };
};

const DashboardOrdersList: React.FC<DashboardOrdersListProps> = ({
  ordersData,
}) => {
  const { toast } = useToast();

  const mutation = useOrderMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const handleChangeStatus = (
    orderId: string,
    status: Exclude<OrderStatus, 'Cancelled'>,
  ) => {
    mutation.mutateAsync({
      type: OrderMutationType.UPDATE,
      orderId,
      data: { status },
    });
  };

  return (
    <Table>
      <TableCaption>A list of your recent orders</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            'Order Id',
            'Customer Name',
            'Date',
            'Status',
            'Total',
            'Actions',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordersData.orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>No orders found</TableCell>
          </TableRow>
        ) : (
          ordersData.orders.map((order) => (
            <TableRow className="whitespace-nowrap" key={order._id}>
              <TableCell>#{order._id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={'/images/avatar.jpg'}
                    alt={'avatar'}
                    width={50}
                    height={50}
                  />
                  <h1>
                    {order.user.first_name} {order.user.last_name}
                  </h1>
                </div>
              </TableCell>
              <TableCell className="max-lg:pl-10">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      OrdersColors[order.status],
                    )}
                  />
                  {order.status}
                </div>
              </TableCell>
              <TableCell>{order.totalPrice}$</TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/orders/${order._id}`}>
                        <DropdownMenuItem>
                          <View />
                          View Details
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      {['Pending', 'Processing', 'Shipped', 'Delivered'].map(
                        (status, i) => (
                          <DropdownMenuItem
                            key={i}
                            onSelect={() =>
                              handleChangeStatus(
                                order._id,
                                status as Exclude<OrderStatus, 'Cancelled'>,
                              )
                            }
                          >
                            {status}
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Total</TableCell>
          <TableCell className="text-right">{ordersData.totalOrders}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default DashboardOrdersList;
