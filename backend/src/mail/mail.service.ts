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
            const port = this.configService.get<number>('SMTP_PORT') || 587;
            const isSecure = port === 465; // Gmail uses 465 for SSL, 587 for TLS

            this.logger.log(`Initializing SMTP with Host: ${host}, Port: ${port}, Secure: ${isSecure}`);

            this.transporter = nodemailer.createTransport({
                host: host,
                port: port,
                secure: isSecure,
                auth: {
                    user: this.configService.get<string>('SMTP_USER'),
                    pass: this.configService.get<string>('SMTP_PASS'),
                },
                // optimizing for cloud environments
                connectionTimeout: 10000, // 10 seconds
                greetingTimeout: 10000,
                socketTimeout: 10000,
                logger: true,
                debug: true,
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
        // Create a fresh transporter for every email to avoid stale connections
        const host = this.configService.get<string>('SMTP_HOST');
        const port = this.configService.get<number>('SMTP_PORT') || 587;
        const isSecure = port === 465;

        // Render/Cloud Fix: Explicitly use Port 587 with STARTTLS
        // This avoids the SSL handshake hang common on Port 465
        const config = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Must be false for 587
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
            tls: {
                ciphers: 'SSLv3'
            },
            requireTLS: true,
            connectionTimeout: 10000,
            greetingTimeout: 10000,
        };

        this.logger.log(`[Mail] Connecting to smtp.gmail.com:587 (STARTTLS)`);

        const transporter = nodemailer.createTransport(config);

        this.logger.log(`Sending email to ${to} via 587 STARTTLS`);

        // Fire-and-forget
        transporter.sendMail({
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

        return { message: 'Email queued' };
    }
}
