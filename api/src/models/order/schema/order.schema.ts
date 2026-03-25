import * as crypto from 'crypto';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/models/user/schema/user.schema';
import { Product } from '@/models/product/schema/product.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: String,
    unique: true,
    default: () =>
      `ORD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
  })
  orderNumber: string;

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
      attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
      // Snapshot of pricing at the moment the order was created.
      // This prevents past orders from changing if admin edits product discount later.
      unitPrice: { type: Number, default: 0 }, // original unit price
      discountPercent: { type: Number, default: 0 }, // applied discount percent
      finalUnitPrice: { type: Number, default: 0 }, // discounted unit price
    },
  ])
  items: {
    product: Product & mongoose.Types.ObjectId;
    quantity: number;
    attributes?: Record<string, any>;
    unitPrice?: number;
    discountPercent?: number;
    finalUnitPrice?: number;
  }[];

  @Prop({ type: Number, required: true, min: 0 })
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
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
