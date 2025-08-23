import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ContactService {
  constructor(private configService: ConfigService) {}

  async sendEmail(
    name: string,
    email: string,
    subject: string,
    message: string,
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${email}>`,
      to: this.configService.get<string>('EMAIL_TO'),
      subject: subject || 'New Contact Form Message',
      html: `
      <h2>New Message from Contact Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    });

    return { success: true, message: 'Email sent successfully!' };
  }
}
