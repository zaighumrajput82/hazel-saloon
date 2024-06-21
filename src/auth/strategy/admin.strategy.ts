import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
    console.log('AdminStrategy initialized'); // Add this line
  }

  async validate(payload: { password; email; type }) {
    console.log('AdminStrategy validate method called'); // Add this line
    const { password, email, type } = payload;

    const ownerVerify = await this.prisma.admin.findUnique({
      where: { password, email },
    });

    if (!ownerVerify) {
      throw new UnauthorizedException('Invalid token or user not verified.');
    }
    return ownerVerify;
  }
}
