import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto, signUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginShopDto } from 'src/shop/dto/login-shop.dto';
import { SignInCustomerDto } from 'src/customer/dto/signIn-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: signUpDto) {
    try {
      const existingUser = await this.prisma.admin.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (!existingUser) {
        const hash = await argon2.hash(dto.password);
        const owner = await this.prisma.admin.create({
          data: {
            name: dto.name,
            password: hash,
            email: dto.email,
            picture: dto.picture,
          },
        });
        return this.signToken(dto.email, dto.password, 'admin');
      } else {
        return 'User with these credentials already exists';
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException(
            'Some Error Occured Please Try Again Later!',
          );
        }
      }
      throw error;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: AuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async adminSignin(dto: AuthDto, res) {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { email: dto.email },
      });

      if (admin) {
        const paswrdMatch = await argon2.verify(
          (await admin).password,
          dto.password,
        );

        if (paswrdMatch) {
          // Create token
          const token = await this.signToken(dto.email, dto.password, 'admin');

          // Set cookies in the response
          res.cookie('access_token', token.access_token, { httpOnly: true });

          // Return token
          return token;
        } else {
          return 'Incorrect Credentials!';
        }
      } else {
        return 'User Does Not Exists';
      }
    } catch (error) {}
  }

  async signToken(
    password: string,
    email: string,
    type: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      password,
      email,
      type,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15d',
      secret: secret,
    });

    return { access_token: token };
  }

  async login(dto: LoginShopDto, res) {
    try {
      const shop = await this.prisma.shop.findFirst({
        where: { email: dto.email },
      });

      if (!shop) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordValid = await argon2.verify(shop.password, dto.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // Create token
      const token = await this.signToken(dto.email, dto.password, 'admin');

      // Set cookies in the response
      res.cookie('access_token', token.access_token, { httpOnly: true });

      // Return token
      return token;
    } catch (error) {
      console.error('Error logging in:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signIn(dto: SignInCustomerDto, res) {
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
      // Create token
      const token = await this.signToken(dto.email, dto.password, 'admin');

      // Set cookies in the response
      res.cookie('access_token', token.access_token, { httpOnly: true });

      // Return token
      return token;
    } catch (error) {
      // Catch and re-throw other errors
      throw error;
    }
  }
}
