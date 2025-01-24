import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateCategoryFilterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  type: 'checkbox' | 'dropdown' | 'range';

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsString()
  min?: number;

  @IsOptional()
  @IsString()
  max?: number;
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsMongoId()
  parentCategory?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryFilterDto)
  filters?: CreateCategoryFilterDto[];
}
