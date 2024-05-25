// otp.dto.ts

import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class OtpDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsBoolean()
  @IsNotEmpty()
  isUsed: boolean;

  @IsDateString()
  @IsNotEmpty()
  expiresAt: Date;
}
