import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
  readonly status?: string;
}
