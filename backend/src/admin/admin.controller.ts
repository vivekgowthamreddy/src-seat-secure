import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ShowsService } from '../shows/shows.service';
import { SeatsService } from '../seats/seats.service';
import { BookingsService } from '../bookings/bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly showsService: ShowsService,
    private readonly seatsService: SeatsService,
    private readonly bookingsService: BookingsService,
  ) {}

  // Shows Management
  @Post('shows')
  async createShow(@Body() body: any) {
    const { movieId, startTime, price, theaterName, category } = body;
    return this.showsService.createShow({
      movieId,
      startTime: new Date(startTime),
      price,
      theaterName,
      category,
      bookedSeats: 0,
      totalSeats: 660,
    });
  }

  @Put('shows/:id')
  async updateShow(@Param('id') id: string, @Body() body: any) {
    return this.showsService.updateShow(id, body);
  }

  @Delete('shows/:id')
  async deleteShow(@Param('id') id: string) {
    return this.showsService.deleteShow(id);
  }

  @Get('shows')
  async getAllShows() {
    return this.showsService.findAll();
  }

  // Bookings Management
  @Get('bookings')
  async getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @Get('reports')
  async getReports() {
    return this.bookingsService.getBookingStats();
  }
}
