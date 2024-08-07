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
      let totalBill = 0;
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
        totalBill += service.price;
      }

      const reservationDetail = { ...reservationData, totalBill };
      // Create the reservation if the maxService limit is not exceeded
      const reservation = await this.prisma.reservation.create({
        data: {
          ...reservationDetail,

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
      let totalBill = 0;
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
        totalBill += service.price;
      }

      const reservationData = { ...restData, totalBill };
      // Update reservation data
      const updatedReservation = await this.prisma.reservation.update({
        where: { id },
        data: {
          ...reservationData,
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

  async getTodayReservation(id: number) {
    try {
      // Helper function to format date to YYYY-MM-DD
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const today = new Date();
      const formattedToday = formatDate(today);
      // console.log(formattedToday);
      const reservations = await this.prisma.reservation.findMany({
        where: {
          shopId: id,
          date: formattedToday.toString(),
        },
      });

      if (!reservations) {
        throw new NotFoundException('No Reservation Found');
      }
      if (reservations.length < 1) {
        return 'No Reservation Found';
      }
      return reservations;
    } catch (error) {
      throw new NotFoundException(
        'An error occurred while retrieving reservations',
      );
    }
  }

  async getAllReservation(id: number) {
    try {
      // console.log(formattedToday);
      const reservations = await this.prisma.reservation.findMany({
        where: {
          shopId: id,
        },
      });

      if (!reservations) {
        throw new NotFoundException('No Reservation Found');
      }
      if (reservations.length < 1) {
        return 'No Reservation Found';
      }
      return reservations;
    } catch (error) {
      throw new NotFoundException(
        'An error occurred while retrieving reservations',
      );
    }
  }
}
