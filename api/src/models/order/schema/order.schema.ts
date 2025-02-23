import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/models/user/schema/user.schema';
import { Product } from '@/models/product/schema/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User & mongoose.Types.ObjectId;

  @Prop([
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ])
  items: {
    product: Product & mongoose.Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ type: Number, required: true, min: 0.01 })
  totalPrice: number;

  @Prop({
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
  })
  address:
    | mongoose.Types.ObjectId
    | {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
