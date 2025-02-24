import React from 'react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from '@/components/ui/buttons/button';

type CreateOrderProps = {} & ButtonProps;

const CreateOrder: React.FC<CreateOrderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Button form="checkout-form" className={cn('w-full', className)} {...props}>
      {children || 'Create Order'}
    </Button>
  );
};

export default CreateOrder;
