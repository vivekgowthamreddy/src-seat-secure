import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();

    // Strict Domain Validation
    if (!email.endsWith('@rguktn.ac.in') && !email.endsWith('@college.edu')) {
      throw new BadRequestException('Registration restricted to official college email (@rguktn.ac.in)');
    }

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      // If they exist (verified or not), just tell them to login. 
      // Since we are removing OTP, we can't "re-verify" them. 
      // If they aren't verified from before, they can't login? 
      // Fix: If they exist but are NOT verified, we should probably just verify them now?
      // No, simpler: "Account already exists. Please log in."
      // If they forgot password, that's a separate issue (Password Reset), but for now, they exist.
      if (!existing.isVerified) {
        // Auto-verify legacy users who got stuck
        await this.usersService.update((existing as any)._id, { isVerified: true });
        return { message: 'Account verified. Please log in.' };
      }
      throw new BadRequestException('Account already exists. Please log in.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create User - Auto Verified
    await this.usersService.createUser({
      email: email,
      passwordHash,
      name: dto.name,
      role: 'student',
      gender: dto.gender,
      isVerified: true, // Bypass Email Verification
    });

    return { message: 'Registration successful. Please log in.' };
  }

  async verifyEmail(email: string, otp: string) {
    // Deprecated but kept to avoid 404s if frontend calls it
    return { message: 'Email verification is disabled. Please log in.' };
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

    // Auto-verify if they manage to login (e.g. legacy unverified users)
    if (user.role === 'student' && !user.isVerified) {
      await this.usersService.update(user._id, { isVerified: true });
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
        isVerified: true
      },
    };
  }
}

