import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { IOrder } from '@/types';
import FieldGroup from '@/helpers/FieldGroup';
import { formatDate, getCategory } from '@/lib/utils';

import { Button } from '@/components/ui/buttons/button';
import { Separator } from '@/components/ui/layout/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/layout/card';

type OrdersHistoryItemProps = {
  order: IOrder;
};

const OrdersHistoryItem: React.FC<OrdersHistoryItemProps> = ({ order }) => {
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
      value: order.totalPrice + ' DIN',
      customStyles,
    },
    {
      id: 3,
      title: 'Ship To',
      value: order.user.first_name + ` ${order.user.last_name}`,
      customStyles,
    },
  ];

  return (
    <li>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-5">
          <div className="flex flex-row items-start gap-20 space-y-0">
            {Header.map((h) => (
              <FieldGroup
                key={h.id}
                title={h.title}
                value={h.value}
                customStyles={h.customStyles}
              />
            ))}
          </div>
          <div>
            <FieldGroup
              title="Order"
              value={order._id}
              customStyles={{
                div: 'flex flex-row',
              }}
            />
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-5">
              <div className="w-fit rounded-lg border">
                <Image
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
                      value={item.product.price + ' DIN'}
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
