import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';
import { ServiceModule } from './service/service.module';
import { ReservationModule } from './reservation/reservation.module';
import { CustomerModule } from './customer/customer.module';
import { OtpModule } from './otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { ReservationStatusService } from './reservation/ReservationStatus.service';
import { ServiceCategoryModule } from './service-category/service-category.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    AdminModule,
    ShopModule,
    ServiceModule,
    ReservationModule,
    CustomerModule,
    OtpModule,
    ServiceCategoryModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // path to the public folder
      serveRoot: '/public/', // route to serve static files
    }),
  ],
  providers: [ReservationStatusService],
})
export class AppModule {}
