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
    if (!dto.email.endsWith('@rguktn.ac.in') && !dto.email.endsWith('@college.edu')) { // college.edu for dev/admin
      throw new BadRequestException('Use official college email (@rguktn.ac.in)');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: 'student',
      gender: dto.gender,
      verificationToken,
      isVerified: false,
    });

    // Send Real Email
    try {
      await this.mailService.sendVerificationEmail(dto.email, verificationToken);
    } catch (error) {
      // If email fails, delete the user so they can try again
      await this.usersService.deleteByEmail(dto.email);
      console.error('Email sending failed:', error);
      throw new BadRequestException('Failed to send verification email. Please check your email address and internet connection.');
    }

    return { message: 'Registration successful. Please verify your email with the OTP sent.' };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.usersService.findByEmail(email) as any;
    if (!user) throw new BadRequestException('User not found');

    if (user.isVerified) return { message: 'Already verified' };

    if (user.verificationToken !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.update(user._id, { isVerified: true, verificationToken: undefined });
    return { message: 'Email verified successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email) as any;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === 'student' && !user.isVerified) {
      throw new UnauthorizedException('Email not verified. Please verify your email first.');
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
