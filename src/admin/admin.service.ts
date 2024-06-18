import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as argon2 from 'argon2';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { signUpDto } from 'src/auth/dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async update(dto: signUpDto) {
    try {
      var hash = await argon2.hash(dto.password);

      const owner = await this.prisma.admin.findUnique({
        where: { email: dto.email },
      });
      const isPasswordValid = await argon2.verify(owner.password, dto.password);

      if (owner && isPasswordValid) {
        const admin = await this.prisma.admin.update({
          where: {
            email: dto.email,
          },
          data: {
            name: dto.name,
            password: hash,
            email: dto.email,
          },
        });
        return 'Success';
      } else {
        return 'No Record Found';
      }
    } catch (error) {}
  }
}
