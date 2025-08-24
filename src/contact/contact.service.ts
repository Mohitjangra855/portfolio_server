import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { timestamp } from 'rxjs/operators';
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
        pass: this.configService.get<string>('EMAIL_PASS'),
        user: this.configService.get<string>('EMAIL_TO'),
      },
    });
    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0ea5a4;padding:20px 24px;color:#ffffff;text-align:left;">
              <h1 style="margin:0;font-size:20px;line-height:1.2;">New Contact Form Message</h1>
              <p style="margin:6px 0 0;font-size:13px;opacity:0.95;">You received a new message via your website contact form.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0;font-weight:600;width:110px;color:#374151;">Name</td>
                  <td style="padding:6px 0;color:#111827;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-weight:600;color:#374151;">Email</td>
                  <td style="padding:6px 0;color:#111827;"><a href="mailto:${email}" style="color:#0ea5a4;text-decoration:none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-weight:600;color:#374151;">Subject</td>
                  <td style="padding:6px 0;color:#111827;">${subject}</td>
                </tr>
              </table>

              <hr style="border:none;border-top:1px solid #e6e9ee;margin:18px 0;">
<h4 style="display:flex;align-items:center;justify-content:center;margin:0 0 8px 0;font-size:15px;color:#374151;">Message</h4>
              <div style="background:#f8fafc;border-radius:6px;padding:10px 8px;border:1px solid #e6e9ee;color:#111827;white-space:pre-wrap;word-wrap:break-word;">
                
                ${message}
              </div>

              <p style="margin:18px 0 0;font-size:13px;color:#6b7280;">
                Reply to the sender via the email above, or view the message in your admin panel.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:12px 24px;text-align:center;color:#9ca3af;font-size:12px;">
              &copy; ${new Date().getFullYear()} Your Website — Sent via contact form
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
    await transporter.sendMail({
      from: `"Portfolio Contact" <${email}>`,
      to: this.configService.get<string>('EMAIL_TO'),
      subject: subject || '',
      html: html,
    });

    return { success: true, message: 'Email sent successfully!' };
  }
}
