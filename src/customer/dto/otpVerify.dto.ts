import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class otpVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
