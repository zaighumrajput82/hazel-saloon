import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, signUpDto } from './dto';
import { JwtGuard } from './guard';
import { SignInCustomerDto } from 'src/customer/dto/signIn-customer.dto';
import { LoginShopDto } from 'src/shop/dto/login-shop.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(JwtGuard)
  @Post('AdminSignin')
  signinAdmin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.adminSignin(dto, res);
  }

  @Post('AdminSignUp')
  signUpAdmin(@Body() dto: signUpDto) {
    return this.authService.signUp(dto);
  }
  @Post('create-admin')
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
  async createAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) createAdminDto: CreateAdminDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const pictureUrl = `/uploads/${file.filename}`;
    const adminData = {
      ...createAdminDto,
      picture: pictureUrl,
    };

    return this.authService.createAdmin(adminData);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: AuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Post('loginshop')
  Login(@Body() dto: LoginShopDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @Post('customer-login')
  async login(
    @Body() dto: SignInCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(dto, res);
  }
}
