import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

import { Cart } from '@/models/cart/schema/cart.schema';
import { Order } from '@/models/order/schema/order.schema';
import { Address } from '@/models/address/schema/address.schema';
import { Review } from '@/models/review/schema/review.schema';
import { Wishlist } from '@/models/wishlist/schema/wishlist.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    trim: true,
  })
  first_name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
    trim: true,
  })
  last_name: string;

  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    trim: true,
    select: false,
  })
  password?: string;

  @Prop({
    default: '',
    trim: true,
  })
  image: string;

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

  @Prop({
    default: false,
  })
  isAdmin: boolean;

  @Prop({ default: false })
  isGoogleAccount: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (user.isModified('password') && user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});
