import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Review } from '@/models/review/schema/review.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  })
  name: string;

  @Prop({ type: Number, required: true, min: 0, max: 100000 })
  price: number;

  @Prop({
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    trim: true,
  })
  description: string;

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ type: Number, required: true, min: 0, max: 1000 })
  stock: number;

  @Prop({ type: Number, default: 0 })
  discount?: number;

  @Prop({ type: Number, default: 0 })
  averageRating?: number;

  @Prop({
    type: Number,
    required: true,
  })
  category: number;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: {},
  })
  attributes: Record<string, any>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    default: [],
  })
  reviews: (Review & mongoose.Types.ObjectId)[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ category: 1 });
ProductSchema.index({ 'attributes.*': 1 });
