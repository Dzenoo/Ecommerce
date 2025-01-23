import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Category } from '@/models/category/schema/category.schema';
import { Review } from '@/models/review/schema/review.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category & string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    default: [],
  })
  reviews: Review[] & string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
