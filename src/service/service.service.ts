import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { dot } from 'node:test/reporters';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateServiceDto) {
    try {
      // Check if the associated shop exists
      const existingShop = await this.prisma.shop.findUnique({
        where: { id: dto.shopId },
      });

      const serviceCategory = await this.prisma.serviceCategory.findUnique({
        where: { id: dto.categoryId },
      });

      if (!serviceCategory) {
        throw new NotFoundException('Service Category not found');
      }

      if (!existingShop) {
        throw new NotFoundException('Shop not found');
      }

      dto.name = dto.name.toUpperCase();

      const existingService = await this.prisma.service.findFirst({
        where: { name: dto.name },
      });

      if (existingService) {
        return dto.name + ' Service Already Exists';
      }

      // Create the service
      const createdService = await this.prisma.service.create({
        data: {
          name: dto.name,
          price: dto.price,
          duration: dto.duration,
          maxService: dto.maxService,
          picture: dto.picture,
          shopId: dto.shopId,
          categoryId: dto.categoryId,
        },
      });

      return createdService;
    } catch (error) {
      // Handle errors appropriately
      throw error;
    }
  }

  async findAll(id: number) {
    try {
      const shop = await this.prisma.shop.findUnique({ where: { id: id } });

      if (shop) {
        return await this.prisma.service.findMany();
      }
      return 'Shop not found';
    } catch (error) {}
  }

  async updateService(dto: UpdateServiceDto) {
    try {
      // Find the shop by id

      const shop = await this.prisma.shop.findUnique({
        where: {
          id: Number(dto.shopId),
        },
      });

      if (!shop) {
        return 'shop not found';
        // throw new NotFoundException('Shop not found');
      }

      const existingService = await this.prisma.service.findUnique({
        where: { id: Number(dto.id) },
      });

      const existingServiceName = await this.prisma.service.findFirst({
        where: { name: dto.name },
      });

      if (existingService) {
        //  Update the shop details
        delete dto.shopId, dto.id;
        if (existingServiceName) {
          return dto.name + ' Already exists';
        }

        const servicCategory = await this.prisma.serviceCategory.findUnique({
          where: { id: dto.categoryId },
        });

        if (!servicCategory) {
          return 'Category Does Not Exists';
        }

        const updatedService = await this.prisma.service.update({
          where: { id: existingService.id },
          data: { ...dto },
        });
        return updatedService;
      }

      // }
    } catch (error) {
      console.error('Error updating shop:', error);
      throw new BadRequestException('Error updating shop');
    }
  }

  async delete(id: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { id: id },
      });

      if (service) {
        // Now delete the service record
        await this.prisma.service.delete({
          where: {
            id: id,
          },
        });
        return 'Deleted';
      }
      return 'No Record Found';
    } catch (error) {
      console.error('Error deleting service:', error);
      throw new Error('Failed to delete service');
    }
  }
}
