'use client';

import { Calendar, Send, ShoppingBag, User } from 'lucide-react';

import { IOrder } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { OrderQueryType, useOrderQuery } from '@/hooks/queries/useOrder.query';
import FieldGroup from '@/helpers/FieldGroup';
import NotFound from '@/components/shared/NotFound';
import DashboardOrderDetailsProducts from './DashboardOrderDetailsProducts';
import LoadingDashboardOrderDetails from '@/components/shared/loading/dashboard/LoadingDashboardOrderDetails';

import { Separator } from '@/components/ui/layout/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';

const OrdersColors: Record<IOrder['status'], string> = {
  Pending: 'text-yellow-500',
  Processing: 'text-orange-500',
  Shipped: 'text-blue-500',
  Delivered: 'text-green-500',
  Cancelled: 'text-red-500',
};

type DashboardOrderDetailsProps = {
  orderId: string;
};

const DashboardOrderDetails: React.FC<DashboardOrderDetailsProps> = ({
  orderId,
}) => {
  const { data, isLoading } = useOrderQuery({
    type: OrderQueryType.GET_ONE,
    params: { orderId },
  });

  if (isLoading) {
    return <LoadingDashboardOrderDetails />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="hide-scrollbar space-y-4 overflow-x-scroll whitespace-nowrap">
        <CardTitle>Order Id: {data.order._id}</CardTitle>
        <FieldGroup
          title={formatDate(data.order.createdAt, 'PPPPpppp')}
          customStyles={{
            div: 'flex flex-row-reverse gap-2 w-fit',
            h1: 'font-semibold tracking-tight',
          }}
        >
          <Calendar />
        </FieldGroup>
        <p
          className={cn('text-sm font-medium', OrdersColors[data.order.status])}
        >
          {data.order.status}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-5">
        <div className="hide-scrollbar grid grid-cols-3 gap-10 overflow-x-scroll whitespace-nowrap max-xl:grid-cols-2 max-lg:grid-cols-1">
          <CardContentItem
            icon={<User />}
            title="Customer"
            fields={[
              {
                title: 'Full name:',
                value: `${data.order.user.first_name} ${data.order.user.last_name}`,
              },
              {
                title: 'Email:',
                value: data.order.user.email,
              },
            ]}
          />
          <CardContentItem
            icon={<ShoppingBag />}
            title="Order Info"
            fields={[
              {
                title: 'Shipping:',
                value: 'Express',
              },
              {
                title: 'Pay Method:',
                value: 'Cash',
              },
              {
                title: 'Status:',
                value: data.order.status,
              },
            ]}
          />
          <CardContentItem
            icon={<Send />}
            title="Deliver to"
            fields={[
              {
                title: 'Address Line 1:',
                value: data.order.address.addressLine1,
              },
              {
                title: 'Address Line 2:',
                value: data.order.address.addressLine2 || 'N/A',
              },
              {
                title: 'City:',
                value: data.order.address.city,
              },
              {
                title: 'Country:',
                value: data.order.address.country,
              },
              {
                title: 'State:',
                value: data.order.address.state,
              },
              {
                title: 'Postal Code:',
                value: data.order.address.postalCode,
              },
            ]}
          />
        </div>
        <Separator />
        <DashboardOrderDetailsProducts order={data.order} />
      </CardContent>
    </Card>
  );
};

const CardContentItem = ({
  icon,
  fields,
  title,
}: {
  icon: React.ReactNode;
  fields: {
    title: string;
    value: string;
  }[];
  title: string;
}) => {
  return (
    <div className="flex items-start gap-2 max-md:flex-col">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </div>
      <div className="space-y-1">
        <h1 className="font-bold">{title}</h1>
        {fields.map((field, i) => (
          <FieldGroup
            key={i}
            title={field.title}
            value={field.value}
            customStyles={{
              div: 'flex-row gap-2',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardOrderDetails;
