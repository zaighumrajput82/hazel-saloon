import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('create')
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.serviceService.findAll();
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
