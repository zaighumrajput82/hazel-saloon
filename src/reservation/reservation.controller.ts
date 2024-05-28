import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CancelReservationDto } from './dto/CancelReservationDto.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('create')
  create(@Body() dto: CreateReservationDto) {
    return this.reservationService.createReservation(dto);
  }

  @Put('update')
  updateReservation(@Body() dto: UpdateReservationDto) {
    let id = dto.id;
    return this.reservationService.update(id, dto);
  }
  @Delete('cancel')
  cancelReservation(@Body() dto: CancelReservationDto) {
    return this.reservationService.cancelReservation(dto);
  }
}
