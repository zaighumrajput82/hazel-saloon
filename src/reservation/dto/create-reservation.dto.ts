import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { status } from '../enum/enum-status';

export class CreateReservationDto {
  @IsString()
  slotTime: string;

  @IsDateString()
  date: string;

  @IsInt()
  customerId: number;

  @IsInt()
  shopId: number;

  @IsNotEmpty()
  status: status;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  serviceIds?: number[];
}
