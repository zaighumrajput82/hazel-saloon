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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, signUpDto } from './dto';
import { JwtGuard } from './guard';
import { SignInCustomerDto } from 'src/customer/dto/signIn-customer.dto';
import { LoginShopDto } from 'src/shop/dto/login-shop.dto';

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
