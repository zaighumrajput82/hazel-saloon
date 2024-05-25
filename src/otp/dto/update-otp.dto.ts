import { PartialType } from '@nestjs/mapped-types';
import { OtpDto } from './create-otp.dto';

export class UpdateOtpDto extends PartialType(OtpDto) {}
