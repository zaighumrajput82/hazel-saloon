import {
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class UpdateShopDto {
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
  @IsEmail()
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
  adminId: number;
  @IsNotEmpty()
  shopId: number;
}
