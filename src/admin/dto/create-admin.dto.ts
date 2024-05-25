import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  picture: string;
}
