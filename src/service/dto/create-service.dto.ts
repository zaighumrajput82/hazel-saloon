import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsInt()
  maxService?: number;

  @IsOptional()
  @IsString()
  picture?: string[];

  @IsNotEmpty()
  @IsInt()
  shopId: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
