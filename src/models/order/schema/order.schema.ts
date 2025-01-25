import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/models/user/schema/user.schema';
import { Product } from '@/models/product/schema/product.schema';
import { Address } from '@/models/address/schema/address.schema';

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
      price: { type: Number, required: true, min: 0.01 },
    },
  ])
  items: {
    product: Product & mongoose.Types.ObjectId;
    quantity: number;
    price: number;
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  })
  shippingAddress: Address & mongoose.Types.ObjectId;

  @Prop({
    type: {
      addressLine1: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
      },
      addressLine2: { type: String, minlength: 5, maxlength: 100 },
      city: { type: String, required: true, minlength: 2, maxlength: 50 },
      state: { type: String, required: true, minlength: 2, maxlength: 50 },
      postalCode: { type: String, required: true, minlength: 5, maxlength: 10 },
      country: { type: String, required: true, minlength: 2, maxlength: 50 },
    },
    required: false,
  })
  manualShippingAddress?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
