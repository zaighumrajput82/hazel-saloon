import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export function generateOTP(length: number): string {
  const characters = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += characters[Math.floor(Math.random() * characters.length)];
  }
  return otp;
}

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.zmetrolimo.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: 'info@zmetrolimo.com', // Sender address
      to, // Receiver address
      subject, // Subject line
      text, // Plain text body
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}
