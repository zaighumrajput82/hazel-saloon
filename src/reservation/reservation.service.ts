import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/CancelReservationDto.dto';
import { send } from 'node:process';
import { sendEmail } from 'src/utils/otp.util';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  //#region  Create Reservation

  async createReservation(createReservationDto: CreateReservationDto) {
    const { serviceIds, ...reservationData } = createReservationDto;

    try {
      // Check for each service ID if the maxService limit is exceeded
      for (const serviceId of serviceIds) {
        const service = await this.prisma.service.findUnique({
          where: { id: serviceId },
        });

        if (!service) {
          throw new ConflictException(`Service with ID ${serviceId} not found`);
        }

        const existingReservationsCount = await this.prisma.reservation.count({
          where: {
            service: {
              some: { id: serviceId },
            },
            slotTime: reservationData.slotTime,
            date: reservationData.date,
          },
        });

        if (existingReservationsCount >= service.maxService) {
          throw new ConflictException(
            `Maximum number of reservations reached for service ID ${serviceId} at the requested time`,
          );
        }
      }

      // Create the reservation if the maxService limit is not exceeded
      const reservation = await this.prisma.reservation.create({
        data: {
          ...reservationData,
          service: {
            connect: serviceIds.map((id) => ({ id })) || [],
          },
        },
      });

      const customer = await this.prisma.customer.findUnique({
        where: {
          id: createReservationDto.customerId,
        },
      });

      await sendEmail(
        customer.email,
        'HAZEL EYE SALOON',
        'Your Reservation Has Been Confirmed',
      );

      return reservation;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create reservation');
    }
  }

  //#endregion Create Reservation

  //#region  Update Reservation

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      const existingReservation = await this.prisma.reservation.findUnique({
        where: { id },
        include: { service: true },
      });

      if (!existingReservation) {
        throw new NotFoundException('Reservation not found');
      }

      const { serviceIds, slotTime, date, ...restData } = updateReservationDto;

      // Check for each service ID if the maxService limit is exceeded
      for (const serviceId of serviceIds) {
        const service = await this.prisma.service.findUnique({
          where: { id: serviceId },
        });

        if (!service) {
          throw new ConflictException(`Service with ID ${serviceId} not found`);
        }

        const existingReservationsCount = await this.prisma.reservation.count({
          where: {
            service: {
              some: { id: serviceId },
            },
            slotTime: slotTime || existingReservation.slotTime,
            date: date || existingReservation.date,
            NOT: { id }, // Exclude current reservation from the count
          },
        });

        if (existingReservationsCount >= service.maxService) {
          throw new ConflictException(
            `Maximum number of reservations reached for service ID ${serviceId} at the requested time`,
          );
        }
      }

      // Update reservation data
      const updatedReservation = await this.prisma.reservation.update({
        where: { id },
        data: {
          ...restData,
          slotTime,
          date,
          service: {
            set: serviceIds.map((id) => ({ id })),
          },
        },
      });

      return updatedReservation;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update reservation');
    }
  }

  //#endregion Update Reservation

  async cancelReservation(cancelReservationDto: CancelReservationDto) {
    const { id } = cancelReservationDto;

    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      await this.prisma.reservation.delete({
        where: { id },
      });

      return { message: 'Reservation cancelled successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to cancel reservation');
    }
  }
}
