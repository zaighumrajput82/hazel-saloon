import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateServiceDto {
  @IsNotEmpty()
  shopId: number;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  id: number; //Service Id
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  duration?: number;

  @IsOptional()
  maxService?: number;

  @IsString()
  @IsOptional()
  picture?: string[];
}
