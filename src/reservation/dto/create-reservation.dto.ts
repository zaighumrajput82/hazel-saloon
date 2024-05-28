import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsString()
  slotTime: string;

  @IsDateString()
  date: string;

  @IsInt()
  customerId: number;

  @IsInt()
  shopId: number;

  @IsString()
  status: string;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  serviceIds?: number[];
}
