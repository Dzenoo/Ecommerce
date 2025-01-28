import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/models/user/schema/user.schema';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User & mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, minlength: 5, maxlength: 100 })
  addressLine1: string;

  @Prop({ type: String, minlength: 5, maxlength: 100 })
  addressLine2?: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
  city: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
  state: string;

  @Prop({ type: String, required: true, minlength: 5, maxlength: 10 })
  postalCode: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
  country: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
