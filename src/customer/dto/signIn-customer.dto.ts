import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class SignInCustomerDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
