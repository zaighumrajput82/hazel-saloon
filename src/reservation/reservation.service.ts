import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/CancelReservationDto.dto';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async createReservation(createReservationDto: CreateReservationDto) {
    const { serviceIds, ...reservationData } = createReservationDto;

    try {
      const reservation = await this.prisma.reservation.create({
        data: {
          ...reservationData,
          service: {
            connect: serviceIds?.map((id) => ({ id })) || [],
          },
        },
      });

      return reservation;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create reservation');
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id },
        include: { service: true },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      // Extract data from DTO or use existing data
      const { slotTime, date, customerId, shopId, status } =
        updateReservationDto;

      // Update related service data if provided
      const serviceIds = updateReservationDto.serviceIds || [];

      // Update reservation data
      const updatedReservation = await this.prisma.reservation.update({
        where: { id },
        data: {
          slotTime,
          date,
          customerId,
          shopId,
          status,
          service: {
            set: serviceIds.map((id) => ({ id })),
          },
        },
      });

      return updatedReservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update reservation');
    }
  }

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
