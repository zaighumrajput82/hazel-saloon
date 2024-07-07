import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsPhoneNumber,
} from 'class-validator';
import { Timestamp } from 'rxjs';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty({ message: 'Phone cannot be empty' })
  @IsPhoneNumber('US', { message: 'Invalid phone number' })
  phone: string;

  @IsString()
  @IsOptional()
  picture: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  openingTime: string;

  @IsString()
  @IsNotEmpty()
  closingTime: string;

  @IsString()
  @IsNotEmpty()
  openingDays: string;

  @IsNotEmpty()
  @IsOptional()
  adminId?: number;
}
