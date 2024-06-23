import * as cron from 'node-cron';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationStatusService {
  private readonly logger = new Logger(ReservationStatusService.name);

  constructor(private readonly prisma: PrismaService) {
    this.scheduleReservationStatusUpdate();
  }

  private scheduleReservationStatusUpdate() {
    cron.schedule('0 0 * * *', async () => {
      await this.updateCompletedReservations();
    });
    this.logger.log(
      'Scheduled reservation status update job set up to run daily at midnight',
    );
  }

  private async updateCompletedReservations() {
    try {
      const today = new Date().toISOString().split('T')[0];

      await this.prisma.reservation.updateMany({
        where: {
          date: { lt: today },
          status: { not: 'COMPLETED' },
        },
        data: { status: 'COMPLETED' },
      });

      this.logger.log('Successfully updated completed reservations');
    } catch (error) {
      this.logger.error('Error updating completed reservations', error);
    }
  }
}
