import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  ArrayMinSize,
  IsOptional,
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

  // @IsString()
  @IsOptional()
  picture: string;
}
