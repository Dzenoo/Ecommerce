import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @Length(2, 15)
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  first_name?: string;

  @IsString()
  @Length(2, 15)
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  last_name?: string;
}
