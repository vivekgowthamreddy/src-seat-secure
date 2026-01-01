import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import axios from 'axios';

@Injectable()
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
      if (!existing.isVerified) {
        // If unverified, resend OTP
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        await this.usersService.update((existing as any)._id, { verificationToken });

        console.log(`[AUTH] Resending OTP to ${email}: ${verificationToken}`);
        this.mailService.sendVerificationEmail(email, verificationToken);

        return { message: 'Account exists but unverified. New OTP sent.' };
      }
      throw new BadRequestException('Account already exists. Please log in.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create User - Unverified
    await this.usersService.createUser({
      email: email,
      passwordHash,
      name: dto.name,
      role: 'student',
      gender: dto.gender,
      verificationToken,
      isVerified: false,
    });

    // Send OTP
    console.log(`[AUTH] Generated OTP for ${email}: ${verificationToken}`);
    this.mailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Registration successful. Pleaase check your email for OTP.' };
  }

  async verifyEmail(email: string, otp: string) {
    const normalizedEmail = email.toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail) as any;
    if (!user) throw new BadRequestException('User not found');

    if (user.verificationToken !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.usersService.update(user._id, { isVerified: true, verificationToken: undefined });

    // Login the user immediately after verification
    const jwtPayload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      message: 'Email verified successfully',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        gender: user.gender,
        isVerified: true
      }
    };
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

    // Block unverified users
    if (user.role === 'student' && !user.isVerified) {
      throw new UnauthorizedException('Email not verified. Please register again to receive OTP.');
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

  async googleLogin(accessToken: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { email, name, picture } = response.data;
      const normalizedEmail = email.toLowerCase();

      // Check if user exists
      let user = await this.usersService.findByEmail(normalizedEmail) as any;

      if (!user) {
        // Regex Validation
        // Allow 6 or 7 digits for student ID
        const domainRegex = /^[nos]\d{6,7}@rgukt(n|sklm|ong)\.ac\.in$/;

        if (!domainRegex.test(normalizedEmail)) {
          throw new BadRequestException('Email domain not allowed. Must be a valid student ID email from RGUKT (N/SKLM/ONG).');
        }

        // Create new user
        // We don't have gender from Google, defaulting or asking user might be needed? 
        // User request: "register new user no need of password and all u=then rest are the same"
        // I'll set a default or leave it empty if schema allows.
        // User schema: gender is an enum ['male', 'female'], not required?
        // Let's check schema again.

        // checking schema...
        // @Prop({ enum: ['male', 'female'] })
        // gender: string;
        // It is NOT marked as required in Prop, so it might be optional. 
        // But let's check if there are other constraints. 
        // Assuming optional.

        // Create new user (Verified)
        // No gender available from minimal google scope or not requested, defaulting to none or letting user update later?
        // Schema doesn't strictly require it on creation if handled properly. Mongoose might complain if enum is strict.
        // Let's set a placeholder or null if schema allows. Providing 'male' or 'female' arbitrarily is bad.
        // Looking at schema: @Prop({ enum: ['male', 'female'] }) gender: string; It's not required explicitly in Prop decorator.

        user = await this.usersService.createUser({
          email: normalizedEmail,
          name: name,
          role: 'student',
          isVerified: true,
          // verificationToken not needed
        });

      } else {
        // Auto-verify if they were unverified and now logging in with Google
        if (!user.isVerified) {
          await this.usersService.update(user._id, { isVerified: true });
          user.isVerified = true;
        }
      }

      const jwtPayload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };

      const jwtToken = this.jwtService.sign(jwtPayload);

      return {
        accessToken: jwtToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          gender: user.gender,
          isVerified: user.isVerified
        }
      };

    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new UnauthorizedException('Invalid Google Token');
    }
  }
}

