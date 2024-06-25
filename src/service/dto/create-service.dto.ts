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
  //@IsNumber()
  price: number;

  @IsOptional()
  //@IsInt()
  duration?: number;

  @IsOptional()
  //@IsInt()
  maxService?: number;

  @IsOptional()
  @IsString({ each: true })
  picture?: string[];

  @IsNotEmpty()
  //@IsNumber()
  shopId: number;

  @IsNotEmpty()
  //@IsInt()
  categoryId: number;
}
