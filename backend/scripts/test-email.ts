
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load env from the backend root
dotenv.config({ path: join(__dirname, '../.env') });

const testEmail = async () => {
    console.log('Testing Email Configuration...');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;

    console.log(`Config: Host=${host}, Port=${port}, User=${user}`);

    if (!user || !pass) {
        console.error('ERROR: SMTP_USER or SMTP_PASS is missing in .env');
        return;
    }

    const isSecure = port === 465;
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        debug: true,
        logger: true
    });

    try {
        console.log('Attempting to send mail...');
        const info = await transporter.sendMail({
            from: `"Test" <${user}>`,
            to: user, // Send to self
            subject: 'Test Email from SAC Seat Secure Local',
            text: 'If you see this, credentials are correct and local network allows SMTP.'
        });
        console.log('SUCCESS: Email sent!', info.messageId);
    } catch (error) {
        console.error('FAILURE: Could not send email.');
        // console.error(error);
    }
};

testEmail();
