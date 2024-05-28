import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsString()
  slotTime?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsInt()
  shopId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  serviceIds?: number[];
}
