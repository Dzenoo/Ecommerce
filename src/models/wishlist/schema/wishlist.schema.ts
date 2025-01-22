import { HydratedDocument } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true })
export class Wishlist {}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
