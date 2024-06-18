import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginShopDto } from './dto/login-shop.dto';
import * as dayjs from 'dayjs';
import { Reservation, Service } from '@prisma/client';
@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  //#region  Create Shop

  async create(createShopDto: CreateShopDto) {
    try {
      // Hash the password before saving to the database
      const hashedPassword = await argon2.hash(createShopDto.password);

      // Create the shop using the Prisma client
      const shop = await this.prisma.shop.create({
        data: {
          location: createShopDto.location,
          name: createShopDto.name,
          phone: createShopDto.phone,
          picture: createShopDto.picture,
          email: createShopDto.email,
          password: hashedPassword,
          openingTime: createShopDto.openingTime,
          closingTime: createShopDto.closingTime,
          openingDays: createShopDto.openingDays,
          adminId: createShopDto.adminId,
        },
      });

      // Return the created shop
      return shop;
    } catch (error) {
      if (error.code === 'P2002') {
        // Handle unique constraint violation (e.g., email already exists)
        throw new BadRequestException('Email already exists');
      }
      // Handle other potential errors
      throw new InternalServerErrorException(
        'An error occurred while creating the shop',
      );
    }
  }

  //#endregion Create Shop

  //#region Find All Shops

  async findAll() {
    try {
      return await this.prisma.shop.findMany();
    } catch (error) {}
  }
  //#endregion Find All Shops

  //#region  Login Shop

  async login(dto: LoginShopDto) {
    try {
      const shop = await this.prisma.shop.findFirst({
        where: { email: dto.email },
      });

      if (!shop) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordValid = await argon2.verify(shop.password, dto.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return { message: 'Login successful', shop };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  //#endregion Login Shop

  //#region  Update Shop

  async updateShop(dto: UpdateShopDto) {
    try {
      // Find the shop by email
      const existingShop = await this.prisma.shop.findFirst({
        where: { email: dto.email },
      });

      if (!existingShop) {
        throw new NotFoundException('Shop not found');
      }

      // Verify the password
      const passwordValid = await argon2.verify(
        existingShop.password,
        dto.password,
      );
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Hash the new password if it's being updated
      if (dto.password) {
        dto.password = await argon2.hash(dto.password);
      }

      // Update the shop details
      const updatedShop = await this.prisma.shop.update({
        where: { id: existingShop.id },
        data: { ...dto },
      });

      return updatedShop;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw new BadRequestException('Error updating shop');
    }
  }

  //#endregion Update Shop

  //#region  Delete Shop

  async delete(id: number) {
    try {
      const shop = await this.prisma.shop.findUnique({
        where: { id: id },
      });

      if (shop) {
        // Delete related records in the Service table first
        await this.prisma.service.deleteMany({
          where: {
            shopId: id,
          },
        });

        // Now delete the shop record
        await this.prisma.shop.delete({
          where: {
            id: id,
          },
        });
        return 'Deleted';
      }
      return 'No Record Found';
    } catch (error) {
      console.error('Error deleting shop:', error);
      throw new Error('Failed to delete shop');
    }
  }

  //#endregion Delete Shop

  //#region  Reservation

  async getService(id: number) {
    // Fetch the service by ID
    const service = await this.prisma.service.findUnique({
      where: { id: id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Fetch the shop associated with the service
    const shop = await this.prisma.shop.findUnique({
      where: { id: service.shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Split the opening days
    const daysArray = shop.openingDays.split(',');
    const hoursOpen = this.calculateHoursOpen(
      shop.openingTime,
      shop.closingTime,
    );

    const openDaysWithSlots = this.getScheduleForMonth(
      // daysArray,
      shop.openingTime,
      shop.closingTime,
    );
    // Fetch reservations for the service
    const reservations = await this.prisma.reservation.findMany({
      where: {
        service: {
          some: {
            id: id,
          },
        },
      },
    });

    // Update slots availability based on reservations
    this.updateSlotsAvailability(openDaysWithSlots, reservations, service);

    return {
      service,
      shop,
      hoursOpen,
      openDays: openDaysWithSlots,
    };
  }

  //#endregion Reservation

  //#region  Monthly Open Days With Dates Calculation

  async getOpenDays(id: number) {
    try {
      const shop = await this.prisma.shop.findUnique({
        where: { id: id },
      });
      if (!shop) {
        throw new NotFoundException('Shop not found');
      }

      const hoursOpen = this.calculateHoursOpen(
        shop.openingTime,
        shop.closingTime,
      );

      const openDaysWithSlots = this.getScheduleForMonth(
        shop.openingTime,
        shop.closingTime,
      );

      const reservations = await this.prisma.reservation.findMany({
        where: {
          date: {
            gte: dayjs().format('YYYY-MM-DD'),
            lt: dayjs().add(30, 'day').format('YYYY-MM-DD'),
          },
        },
      });

      const services = await this.prisma.service.findMany();

      services.forEach((service) => {
        this.updateSlotsAvailability(openDaysWithSlots, reservations, service);
      });

      return {
        shop,
        hoursOpen,
        startsTime: shop.openingTime,
        endTime: shop.closingTime,
        openDays: openDaysWithSlots,
      };
    } catch (error) {
      console.error('Error getting open days:', error);
      throw new Error('Could not get open days');
    }
  }

  updateSlotsAvailability(openDaysWithSlots, reservations, service) {
    const serviceDuration = service.duration;
    const maxService = service.maxService;

    openDaysWithSlots.forEach((day) => {
      // Skip processing for Sunday
      if (day.day === 'Sunday') {
        return;
      }

      day.slots = day.slots.map((slot) => {
        const [slotStartTime, slotEndTime] = slot.split(' - ');
        const startTime = dayjs(day.date + ' ' + slotStartTime);

        // Count the number of bookings for this slot
        const numBookings = reservations.reduce((count, reservation) => {
          if (reservation.date === day.date && reservation.slotTime === slot) {
            return count + 1;
          }

          const [reservationStartTime, reservationEndTime] =
            reservation.slotTime.split(' - ');
          const reservationStart = dayjs(
            reservation.date + ' ' + reservationStartTime,
          );
          const reservationEnd = dayjs(
            reservation.date + ' ' + reservationEndTime,
          );

          // Check if the reservation overlaps with the current slot
          if (
            (reservationStart.isBefore(startTime) &&
              reservationEnd.isAfter(startTime)) ||
            (reservationStart.isBefore(
              startTime.add(serviceDuration, 'minute'),
            ) &&
              reservationEnd.isAfter(startTime.add(serviceDuration, 'minute')))
          ) {
            return count + 1;
          }

          return count;
        }, 0);

        // Check if the number of bookings exceeds maxService
        if (numBookings >= maxService) {
          // Mark the slot as unavailable
          return `${slotStartTime} - ${slotEndTime} (Booked)`;
        }

        // Return the slot as available
        return `${slotStartTime} - ${slotEndTime} (Available)`;
      });
    });
  }

  getScheduleForMonth(openingTime: string, closingTime: string) {
    const today = dayjs();
    const endDate = today.add(1, 'month');
    const schedule = [];

    let currentDate = today;

    while (currentDate.isBefore(endDate)) {
      const slots = this.generateSlotsForDay(
        openingTime,
        closingTime,
        currentDate,
      );
      schedule.push({
        day: currentDate.format('dddd'),
        date: currentDate.format('YYYY-MM-DD'),
        month: currentDate.format('MMMM'),
        slots,
      });

      currentDate = currentDate.add(1, 'day');
    }

    return schedule;
  }

  calculateHoursOpen(openingTime: string, closingTime: string): number {
    const [openingHour, openingMinute] = openingTime.split(':').map(Number);
    const [closingHour, closingMinute] = closingTime.split(':').map(Number);

    const openingDate = new Date();
    openingDate.setHours(openingHour, openingMinute, 0, 0);

    const closingDate = new Date();
    closingDate.setHours(closingHour, closingMinute, 0, 0);

    const hoursOpen =
      (closingDate.getTime() - openingDate.getTime()) / (1000 * 60 * 60);

    return parseFloat(hoursOpen.toFixed(2));
  }

  generateSlotsForDay(
    openingTime: string,
    closingTime: string,
    date: dayjs.Dayjs,
  ) {
    const slots = [];
    let slotStart = dayjs(date.format('YYYY-MM-DD') + ' ' + openingTime);
    const slotEnd = dayjs(date.format('YYYY-MM-DD') + ' ' + closingTime);

    while (slotStart.isBefore(slotEnd)) {
      slots.push(
        slotStart.format('HH:mm') +
          ' - ' +
          slotStart.add(30, 'minute').format('HH:mm'),
      );
      slotStart = slotStart.add(30, 'minute');
    }

    return slots;
  }
  //#endregion  Monthly Open Days With Dates Calculation
}
