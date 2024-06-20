import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SuperAdminGuards } from 'src/auth/guard';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  @UseGuards(SuperAdminGuards)
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Get('all')
  findAll(@Body() body: { id: number }) {
    return this.serviceService.findAll(body.id);
  }

  @Post('update')
  updateShop(@Body() dto: UpdateServiceDto) {
    return this.serviceService.updateService(dto);
  }

  @Delete('id')
  deleteShop(@Body() body: { id: number }) {
    return this.serviceService.delete(body.id);
  }
}
