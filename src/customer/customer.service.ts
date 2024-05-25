import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpCustomerDto } from './dto/signUp-customer.dto';
import { generateOTP } from '../utils/otp.util';
import * as argon2 from 'argon2';
import { addMinutes } from 'date-fns';
import * as nodemailer from 'nodemailer'; // Import Nodemailer
import { sendEmail } from '../utils/otp.util';
import { otpVerifyDto } from './dto/otpVerify.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Prisma } from '@prisma/client';
import { signUpDto } from 'src/auth/dto';
import { SignInCustomerDto } from './dto/signIn-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  //#region  Signup

  async signUp(dto: SignUpCustomerDto) {
    try {
      // Check if customer already exists
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: dto.email },
      });

      if (existingCustomer) {
        // Check if customer is already verified
        if (existingCustomer.isVerified) {
          throw new BadRequestException(
            'Email is already registered and verified',
          );
        } else {
          return 'Email is already registered but not verified';
        }
      }

      // Generate OTP and set expiry time
      const otp = generateOTP(4);
      const otpExpiry = addMinutes(new Date(), 1);

      // Find existing OTP record
      const existingOTP = await this.prisma.otp.findUnique({
        where: { email: dto.email },
      });

      if (existingOTP) {
        // Update existing OTP record
        await this.prisma.otp.update({
          where: { email: dto.email },
          data: {
            otp,
            expiresAt: otpExpiry,
            isUsed: false,
          },
        });
      } else {
        // Create new OTP record
        await this.prisma.otp.create({
          data: {
            email: dto.email,
            otp,
            expiresAt: otpExpiry,
            isUsed: false,
          },
        });
      }

      // Send email with OTP to the user
      await sendEmail(
        dto.email,
        'OTP for Verification',
        `Your OTP for verification is: ${otp}`,
      );

      // Hash the password
      const hashedPassword = await argon2.hash(dto.password);

      // Create new customer
      const newCustomer = await this.prisma.customer.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          gender: dto.gender,
          address: dto.address,
          picture: dto.picture,
          email: dto.email,
          password: hashedPassword,
          isVerified: false,
        },
      });

      return newCustomer;
    } catch (error) {
      console.error('Error signing up customer:', error);
      throw new BadRequestException('Error signing up customer');
    }
  }
  //#endregion Signup

  //#region  Verify OTP
  async verifyOtp(dto: otpVerifyDto) {
    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email: dto.email,
        otp: dto.otp,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.customer.update({
      where: { email: dto.email },
      data: { isVerified: true },
    });

    await this.prisma.otp.deleteMany({
      where: { email: dto.email },
    });

    return { message: 'OTP verified successfully' };
  }
  //#endregion Verify OTP

  async update(dto: UpdateCustomerDto) {
    try {
      // Check if the customer exists
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: dto.email },
      });

      if (!existingCustomer) {
        throw new NotFoundException('Customer not found');
      }

      dto.email = existingCustomer.email;
      dto.isVerified = true;
      dto.password = await argon2.hash(dto.password);
      // Perform the update operation
      const updatedCustomer = await this.prisma.customer.update({
        where: { email: dto.email },
        data: { ...dto },
      });

      return updatedCustomer;
    } catch (error) {
      // Handle errors
      console.error('Error updating customer:', error);
      throw new Error('Error updating customer');
    }
  }

  async signIn(dto: SignInCustomerDto) {
    try {
      // Find the customer by email
      const customer = await this.prisma.customer.findUnique({
        where: { email: dto.email },
      });

      // If customer does not exist, throw UnauthorizedException
      if (!customer) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Verify the password
      const isPasswordValid = await argon2.verify(
        customer.password, // Hash stored in the database
        dto.password, // Password entered by the user
      );

      // If password is invalid, throw UnauthorizedException
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Return the customer if authentication is successful
      return customer;
    } catch (error) {
      // Catch and re-throw other errors
      throw error;
    }
  }
}
