import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) {
        this.initTransport();
    }

    private async initTransport() {
        const host = this.configService.get<string>('SMTP_HOST');

        if (host) {
            // Use configured SMTP
            this.transporter = nodemailer.createTransport({
                host: this.configService.get<string>('SMTP_HOST'),
                port: this.configService.get<number>('SMTP_PORT') || 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: this.configService.get<string>('SMTP_USER'),
                    pass: this.configService.get<string>('SMTP_PASS'),
                },
            });
            this.logger.log(`Configured with SMTP host: ${host}`);
        } else {
            // Use Ethereal for testing
            try {
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                this.logger.log('SMTP not configured. Using Ethereal Email for testing.');
                this.logger.log(`Ethereal Creds: ${testAccount.user} / ${testAccount.pass}`);
            } catch (err) {
                this.logger.error('Failed to create Ethereal account', err);
            }
        }
    }

    async sendVerificationEmail(to: string, otp: string) {
        if (!this.transporter) {
            await this.initTransport();
        }

        // Fire-and-forget: Don't await the email sending to prevent blocking the response
        this.transporter.sendMail({
            from: `"SAC Booking" <${this.configService.get<string>('SMTP_USER')}>`,
            to,
            subject: 'Verify Your Email - SAC Seat Secure',
            text: `Your One-Time Password (OTP) for registration is: ${otp}. It expires in 10 minutes.`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                <h2 style="color: #333;">SAC Seat Secure</h2>
                <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
                <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
                <hr />
                <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
            </div>
            `,
        }).then((info) => {
            this.logger.log(`Message sent: ${info.messageId}`);
        }).catch((error) => {
            this.logger.error('Failed to send email in background', error);
        });

        // Return immediately
        return { message: 'Email queued' };

    }
}
