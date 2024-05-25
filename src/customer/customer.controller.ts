import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SignUpCustomerDto } from './dto/signUp-customer.dto';
import { dot } from 'node:test/reporters';
import { otpVerifyDto } from './dto/otpVerify.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SignInCustomerDto } from './dto/signIn-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('signup')
  async signUp(@Body() signUpCustomerDto: SignUpCustomerDto) {
    return this.customerService.signUp(signUpCustomerDto);
  }

  @Post('login')
  async login(@Body() dto: SignInCustomerDto) {
    return this.customerService.signIn(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: otpVerifyDto) {
    return this.customerService.verifyOtp(dto);
  }

  @Put('update')
  async update(@Body() dto: UpdateCustomerDto) {
    return this.customerService.update(dto);
  }
}
