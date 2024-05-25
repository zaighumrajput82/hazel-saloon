import { Injectable } from '@nestjs/common';
import { OtpDto } from './dto/create-otp.dto';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'info@mozesto.com',
        pass: 'mozesto12345@',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'info@mozesto.com',
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
