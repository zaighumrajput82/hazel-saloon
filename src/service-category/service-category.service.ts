import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServiceCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceCategoryDto) {
    try {
      const serviceCategory = await this.prisma.serviceCategory.create({
        data: {
          name: dto.name,
        },
      });
      return serviceCategory;
    } catch (error) {
      if (error.code === 'P2002') {
        // P2002 is the error code for unique constraint violation
        throw new ConflictException(
          'Service category with this name already exists',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create service category',
      );
    }
  }

  async update(id: number, dto: UpdateServiceCategoryDto) {
    try {
      const existingServiceCategory =
        await this.prisma.serviceCategory.findUnique({
          where: { id },
        });

      if (!existingServiceCategory) {
        throw new NotFoundException(`Service category with ID ${id} not found`);
      }

      const serviceCategory = await this.prisma.serviceCategory.update({
        where: { id },
        data: { ...dto },
      });
      return serviceCategory;
    } catch (error) {
      if (error.code === 'P2002') {
        // P2002 is the error code for unique constraint violation
        throw new ConflictException(
          'Service category with this name already exists',
        );
      }
      throw new InternalServerErrorException(
        'Failed to update service category',
      );
    }
  }

  async delete(id: number) {
    try {
      const existingServiceCategory =
        await this.prisma.serviceCategory.findUnique({
          where: { id },
        });

      if (!existingServiceCategory) {
        throw new NotFoundException(`Service category with ID ${id} not found`);
      }

      await this.prisma.serviceCategory.delete({
        where: { id },
      });
      return { message: 'Service category deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete service category',
      );
    }
  }
}
