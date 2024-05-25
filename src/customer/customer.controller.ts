import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SignUpCustomerDto } from './dto/signUp-customer.dto';
import { dot } from 'node:test/reporters';
import { otpVerifyDto } from './dto/otpVerify.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('signup')
  async signUp(@Body() signUpCustomerDto: SignUpCustomerDto) {
    return this.customerService.signUp(signUpCustomerDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: otpVerifyDto) {
    return this.customerService.verifyOtp(dto);
  }
}
