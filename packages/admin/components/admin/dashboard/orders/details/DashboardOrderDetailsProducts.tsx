import Image from 'next/image';

import { IOrder } from '@shared/types';
import FieldGroup from '@shared/helpers/FieldGroup';
import { formatPrice } from '@shared/lib/utils/currency.utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/utilities/table';

type DashboardOrderDetailsProductsProps = {
  order: IOrder;
};

const DashboardOrderDetailsProducts: React.FC<
  DashboardOrderDetailsProductsProps
> = ({ order }) => {
  const tax = 400;

  return (
    <div className="space-y-3">
      <div>
        <h1 className="font-semibold">Products</h1>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {['Product Name', 'Attributes', 'Price', 'Quantity', 'Total'].map((header) => (
                <TableHead className="whitespace-nowrap" key={header}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow className="whitespace-nowrap" key={item._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      className="h-12 w-12 object-cover"
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={50}
                      height={50}
                    />
                    <h1>{item.product.name}</h1>
                  </div>
                </TableCell>
                <TableCell>
                  {item.attributes && Object.keys(item.attributes).length > 0 ? (
                    <div className="space-y-0.5 text-sm">
                      {Object.entries(item.attributes).map(([key, value]) => (
                        <div key={key}>
                          <span className="capitalize text-muted-foreground">{key}:</span>{' '}
                          <span className="capitalize">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="max-sm:pl-5">
                  {(() => {
                    const basePrice = item.unitPrice ?? item.product.price;
                    const discountPercent =
                      item.discountPercent ?? item.product.discount ?? 0;
                    const finalUnitPrice =
                      item.finalUnitPrice ??
                      (discountPercent > 0
                        ? Math.round(
                            basePrice * (1 - discountPercent / 100) * 100,
                          ) / 100
                        : basePrice);

                    return discountPercent > 0 ? (
                      <div className="space-y-0.5">
                        <div>
                          {formatPrice(finalUnitPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(basePrice)}
                        </div>
                      </div>
                    ) : (
                      <>
                        {formatPrice(basePrice)}
                      </>
                    );
                  })()}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {(() => {
                    const basePrice = item.unitPrice ?? item.product.price;
                    const discountPercent =
                      item.discountPercent ?? item.product.discount ?? 0;
                    const finalUnitPrice =
                      item.finalUnitPrice ??
                      (discountPercent > 0
                        ? Math.round(
                            basePrice * (1 - discountPercent / 100) * 100,
                          ) / 100
                        : basePrice);

                    const lineTotal =
                      Math.round(finalUnitPrice * item.quantity * 100) / 100;
                    return formatPrice(lineTotal);
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-end justify-end gap-5 max-sm:items-start max-sm:justify-between">
        <div className="space-y-4 max-sm:w-full">
          <FieldGroup
            title="Subtotal:"
            value={formatPrice(order.totalPrice)}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between max-sm:gap-5',
            }}
          />
          <FieldGroup
            title="Tax(20%):"
            value={formatPrice(tax)}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between max-sm:gap-5',
            }}
          />
          <FieldGroup
            title="Total:"
            value={formatPrice(order.totalPrice + tax)}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between font-bold text-xl max-sm:gap-5',
            }}
          />
          <FieldGroup
            title="Status:"
            value={`${order.status}`}
            customStyles={{
              div: 'flex-row gap-40 items-center justify-between max-sm:gap-5',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOrderDetailsProducts;
