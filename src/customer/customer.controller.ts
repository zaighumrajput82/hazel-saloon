import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Res,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { SignUpCustomerDto } from './dto/signUp-customer.dto';
import { dot } from 'node:test/reporters';
import { otpVerifyDto } from './dto/otpVerify.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SignInCustomerDto } from './dto/signIn-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post('signup')
  // async signUp(@Body() signUpCustomerDto: SignUpCustomerDto) {
  //   return this.customerService.signUp(signUpCustomerDto);
  // }
  @Post('signup')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createCustomer(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: SignUpCustomerDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const pictureUrl = `/uploads/${file.filename}`;
    const customerData = {
      ...dto,
      picture: pictureUrl,
    };

    return this.customerService.signUp(customerData);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: otpVerifyDto) {
    return this.customerService.verifyOtp(dto);
  }

  // @Put('update')
  // async update(@Body() dto: UpdateCustomerDto) {
  //   return this.customerService.update(dto);
  // }
  @Put('update')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateCustomer(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: SignUpCustomerDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const pictureUrl = `/uploads/${file.filename}`;
    const customerData = {
      ...dto,
      picture: pictureUrl,
    };

    return this.customerService.update(customerData);
  }
}
