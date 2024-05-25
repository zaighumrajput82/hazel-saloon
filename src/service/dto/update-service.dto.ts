import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateServiceDto {
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
