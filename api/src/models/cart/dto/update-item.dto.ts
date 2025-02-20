import { IsEnum, IsNumber } from 'class-validator';

export class UpdateItemDto {
  @IsEnum(['increment', 'decrement'])
  action: 'increment' | 'decrement';
}
