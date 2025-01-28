import { IsEnum, IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsNumber()
  quantity: number;

  @IsEnum(['increment', 'decrement'])
  action: 'increment' | 'decrement';
}
