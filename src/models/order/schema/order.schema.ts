import { HydratedDocument } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {}

export const OrderSchema = SchemaFactory.createForClass(Order);
