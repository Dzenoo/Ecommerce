import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  })
  discountType: 'percentage' | 'fixed';

  @Prop({ type: Number, required: true })
  discountValue: number;

  @Prop({ type: Date, required: true })
  expirationDate: Date;

  @Prop({ type: Number, default: 0 })
  maxUsage: number;

  @Prop({ type: Number, default: 0 })
  usageCount: number;

  @Prop({ type: Number, required: false, default: 0 })
  minPurchaseAmount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
