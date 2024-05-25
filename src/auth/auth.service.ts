import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto, signUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
        return this.signToken(dto.email, dto.password);
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

  async adminSignin(dto: AuthDto) {
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
          return 'Logged In Successfully';
          //  return this.signToken(dto.email, dto.password);
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
  ): Promise<{ access_token: string }> {
    const payload = {
      password,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return { access_token: token };
  }
}
