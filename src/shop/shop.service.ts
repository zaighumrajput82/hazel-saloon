import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginShopDto } from './dto/login-shop.dto';
@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}
  async create(createShopDto: CreateShopDto) {
    try {
      // Hash the password before saving to the database
      const hashedPassword = await argon2.hash(createShopDto.password);

      // Create the shop using the Prisma client
      const shop = await this.prisma.shop.create({
        data: {
          location: createShopDto.location,
          name: createShopDto.name,
          phone: createShopDto.phone,
          picture: createShopDto.picture,
          email: createShopDto.email,
          password: hashedPassword,
          openingTime: createShopDto.openingTime,
          closingTime: createShopDto.closingTime,
          openingDays: createShopDto.openingDays,
          adminId: createShopDto.adminId,
        },
      });

      // Return the created shop
      return shop;
    } catch (error) {
      if (error.code === 'P2002') {
        // Handle unique constraint violation (e.g., email already exists)
        throw new BadRequestException('Email already exists');
      }
      // Handle other potential errors
      throw new InternalServerErrorException(
        'An error occurred while creating the shop',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.shop.findMany();
    } catch (error) {}
  }

  async login(dto: LoginShopDto) {
    try {
      const shop = await this.prisma.shop.findFirst({
        where: { email: dto.email },
      });

      if (!shop) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordValid = await argon2.verify(shop.password, dto.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return { message: 'Login successful', shop };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async updateShop(dto: UpdateShopDto) {
    try {
      // Find the shop by email
      const existingShop = await this.prisma.shop.findFirst({
        where: { email: dto.email },
      });

      if (!existingShop) {
        throw new NotFoundException('Shop not found');
      }

      // Verify the password
      const passwordValid = await argon2.verify(
        existingShop.password,
        dto.password,
      );
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Hash the new password if it's being updated
      if (dto.password) {
        dto.password = await argon2.hash(dto.password);
      }

      // Update the shop details
      const updatedShop = await this.prisma.shop.update({
        where: { id: existingShop.id },
        data: { ...dto },
      });

      return updatedShop;
    } catch (error) {
      console.error('Error updating shop:', error);
      throw new BadRequestException('Error updating shop');
    }
  }
  async delete(id: number) {
    try {
      const shop = await this.prisma.shop.findUnique({
        where: { id: id },
      });

      if (shop) {
        // Delete related records in the Service table first
        await this.prisma.service.deleteMany({
          where: {
            shopId: id,
          },
        });

        // Now delete the shop record
        await this.prisma.shop.delete({
          where: {
            id: id,
          },
        });
        return 'Deleted';
      }
      return 'No Record Found';
    } catch (error) {
      console.error('Error deleting shop:', error);
      throw new Error('Failed to delete shop');
    }
  }
}
