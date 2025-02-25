import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetReviewsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  readonly skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 10))
  readonly limit?: number = 10;

  @IsOptional()
  @IsString()
  readonly sort?: string;
}
