import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    if (!email.endsWith('@rguktn.ac.in') && !email.endsWith('@college.edu')) { // college.edu for dev/admin
      throw new BadRequestException('Use official college email (@rguktn.ac.in)');
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      if (!existing.isVerified) {
        // Handle "Unverified Deadlock": Resend OTP
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // Use user._id from the existing record
        await this.usersService.update((existing as any)._id, { verificationToken });

        console.log(`[AUTH] Resending OTP for ${email}: ${verificationToken}`);
        try {
          await this.mailService.sendVerificationEmail(email, verificationToken);
        } catch (error) {
          console.error('Email sending failed:', error);
          throw new BadRequestException('Failed to send verification email.');
        }
        return { message: 'Account exists but was not verified. A new OTP has been sent to your email.' };
      }
      throw new BadRequestException('Account already exists and is verified. Please log in.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    await this.usersService.createUser({
      email: email,
      passwordHash,
      name: dto.name,
      role: 'student',
      gender: dto.gender,
      verificationToken,
      isVerified: false,
    });

    // Send Real Email
    console.log(`[AUTH] Generated OTP for ${email}: ${verificationToken}`);
    try {
      await this.mailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      // If email fails, delete the user so they can try again
      await this.usersService.deleteByEmail(email);
      console.error('Email sending failed:', error);
      throw new BadRequestException('Failed to send verification email. Please check your email address and internet connection.');
    }

    return { message: 'Registration successful. Please verify your email with the OTP sent.' };
  }

  async verifyEmail(email: string, otp: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail) as any;
    if (!user) throw new BadRequestException('User not found');

    if (user.isVerified) return { message: 'Already verified' };

    if (user.verificationToken !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.update(user._id, { isVerified: true, verificationToken: undefined });
    return { message: 'Email verified successfully' };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail) as any;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (User not found)');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials (Password incorrect)');
    }

    if (user.role === 'student' && !user.isVerified) {
      // Auto-fix deadlock: if they try to login but aren't verified, maybe we should tell them to check email?
      throw new UnauthorizedException('Email not verified. Please register again to resend OTP.');
    }

    const accessToken = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        gender: user.gender,
        isVerified: user.isVerified
      },
    };
  }
}

