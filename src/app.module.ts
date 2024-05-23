import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';
import { ServiceModule } from './service/service.module';
import { ReservationModule } from './reservation/reservation.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, PrismaModule, AdminModule, ShopModule, ServiceModule, ReservationModule, CustomerModule],
})
export class AppModule {}
