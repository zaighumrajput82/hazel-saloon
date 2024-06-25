import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          // url: 'postgresql://postgres:123@localhost:5434/Hazel_BACKEND?schema=public',
          // url: process.env.DATABASE_URL,
          url: 'postgres://postgres.nlvyjknbsgfhtrchadqa:A!r=6_+3.p8[m@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
        },
      },
    });
  }
}
