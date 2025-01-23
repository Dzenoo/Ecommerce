import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 2,
    maxlength: 50,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  parentCategory?: mongoose.Types.ObjectId;

  @Prop({
    type: [
      {
        name: { type: String, required: true, trim: true },
        type: {
          type: String,
          enum: ['checkbox', 'dropdown', 'range'],
          required: true,
        },
        options: { type: [String], default: [] },
        min: { type: Number },
        max: { type: Number },
      },
    ],
    default: [],
  })
  filters: {
    name: string;
    type: 'checkbox' | 'dropdown' | 'range';
    options?: string[];
    min?: number;
    max?: number;
  }[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ parentCategory: 1 });
