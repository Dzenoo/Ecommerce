import { HydratedDocument } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {}

export const CategorySchema = SchemaFactory.createForClass(Category);
