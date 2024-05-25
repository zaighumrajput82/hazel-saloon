import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class signUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsString()
  picture: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsBoolean()
  isVerified: boolean;
}
