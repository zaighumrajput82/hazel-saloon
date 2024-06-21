import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { AdminStrategy } from './strategy/admin.strategy';
import { SuperAdminGuards } from './guard';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.register({
      secret: 'JWT_SECRET', // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Set the expiration time for tokens
    }),
    PassportModule.register({ defaultStrategy: 'admin' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    ConfigService,
    JwtStrategy,
    AdminStrategy,
    SuperAdminGuards,
  ],
})
export class AuthModule {}
