import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationsController } from './reservation.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationService, PrismaService],
})
export class ReservationModule {}
