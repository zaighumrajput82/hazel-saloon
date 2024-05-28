// src/reservation/dto/cancel-reservation.dto.ts

import { IsInt } from 'class-validator';

export class CancelReservationDto {
  @IsInt()
  id: number;
}
