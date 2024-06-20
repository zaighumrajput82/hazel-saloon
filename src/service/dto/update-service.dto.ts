import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateServiceDto {
  @IsNotEmpty()
  @IsNumber()
  shopId: number;

  @IsNotEmpty()
  @IsNumber()
  id: number; //Service Id
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  maxService?: number;

  @IsString()
  @IsOptional()
  picture?: string;
}
