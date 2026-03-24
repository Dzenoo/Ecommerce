import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Cart } from '@/models/cart/schema/cart.schema';
import { Order } from '@/models/order/schema/order.schema';
import { Address } from '@/models/address/schema/address.schema';
import { Review } from '@/models/review/schema/review.schema';
import { Wishlist } from '@/models/wishlist/schema/wishlist.schema';
import { Role } from '@/types';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true })
  clerkId: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null })
  cart: Cart | mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist',
    default: null,
  })
  wishlist: Wishlist | mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    default: [],
  })
  orders: (Order | mongoose.Types.ObjectId)[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    default: [],
  })
  addresses: (Address | mongoose.Types.ObjectId)[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    default: [],
  })
  reviews: (Review | mongoose.Types.ObjectId)[];
}

export const UserSchema = SchemaFactory.createForClass(User);
