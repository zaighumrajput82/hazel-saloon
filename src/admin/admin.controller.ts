import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { dot } from 'node:test/reporters';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { signUpDto } from 'src/auth/dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(JwtGuard)
  @Put('update')
  update(@Body() dto: signUpDto) {
    return this.adminService.update(dto);
  }
}
