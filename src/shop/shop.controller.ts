import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { dot } from 'node:test/reporters';
import { LoginShopDto } from './dto/login-shop.dto';
import { get } from 'node:http';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create')
  create(@Body() dto: CreateShopDto) {
    return this.shopService.create(dto);
  }

  @Post('login')
  Login(@Body() dto: LoginShopDto) {
    return this.shopService.login(dto);
  }
  @Post('update')
  updateShop(@Body() dto: UpdateShopDto) {
    return this.shopService.updateShop(dto);
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
