import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user.userId, dto);
  }

  @Get()
  async getUserBookings(@CurrentUser() user: any) {
    return this.bookingsService.getUserBookings(user.userId);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.getBookingById(id, user.userId);
  }
}
