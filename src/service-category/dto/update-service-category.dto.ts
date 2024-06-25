import { IsString, IsOptional } from 'class-validator';

export class UpdateServiceCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;
}
