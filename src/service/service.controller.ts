import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { SuperAdminGuards } from 'src/auth/guard';
import { FilesInterceptor } from '@nestjs/platform-express';

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

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('picture', 10, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createService(
    @UploadedFiles() files: Express.Multer.File[], // Use UploadedFiles to handle multiple files
    @Body() createServiceDto: CreateServiceDto,
  ) {
    const pictureUrls = files.map((file) => file.path.replace(/\\/g, '/')); // Replace backslashes with forward slashes for compatibility
    const serviceData = { ...createServiceDto, picture: pictureUrls };

    return this.serviceService.create(serviceData);
  }
}
