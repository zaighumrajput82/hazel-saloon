import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { dot } from 'node:test/reporters';
import { LoginShopDto } from './dto/login-shop.dto';
import { get } from 'node:http';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create-shop')
  @UseInterceptors(
    FileInterceptor('picture', {
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
  async createShop(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: CreateShopDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const pictureUrl = `/uploads/${file.filename}`;
    const adminData = {
      ...dto,
      picture: pictureUrl,
    };
    adminData.adminId = Number(adminData.adminId);
    return this.shopService.create(adminData, pictureUrl);
  }

  @Post('login')
  Login(@Body() dto: LoginShopDto) {
    return this.shopService.login(dto);
  }
  // @Post('update')
  // updateShop(@Body() dto: UpdateShopDto) {
  //   return this.shopService.updateShop(dto);
  // }
  @Post('update')
  @UseInterceptors(
    FileInterceptor('picture', {
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
  async updateShop(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) dto: UpdateShopDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const pictureUrl = `/uploads/${file.filename}`;
    const shopData = {
      ...dto,
      picture: pictureUrl,
    };
    shopData.adminId = Number(shopData.adminId);
    shopData.shopId = Number(shopData.shopId);
    // console.log(shopData);
    return this.shopService.updateShop(shopData, pictureUrl);
  }

  @Get('allShops')
  findShops() {
    return this.shopService.findAll();
  }

  @Delete('id')
  deleteShop(@Body() body: { id: number }) {
    return this.shopService.delete(body.id);
  }
  @Get('openDays')
  getOpenDays(@Body() body: { id: number }) {
    return this.shopService.getOpenDays(body.id);
  }

  @Get('id')
  getSlots(@Body() body: { id: number }) {
    return this.shopService.getService(body.id);
  }
}
