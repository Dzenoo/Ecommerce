import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/models/user/schema/user.schema';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: '',
  })
  user: User & mongoose.Types.ObjectId;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
