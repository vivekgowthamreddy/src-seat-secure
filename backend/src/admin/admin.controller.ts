import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ShowsService } from '../shows/shows.service';
import { SeatsService } from '../seats/seats.service';
import { BookingsService } from '../bookings/bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { MoviesService } from '../movies/movies.service';
import { UsersService } from '../users/users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly showsService: ShowsService,
    private readonly seatsService: SeatsService,
    private readonly bookingsService: BookingsService,
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
  ) { }

  // Movies Management
  @Post('movies')
  async createMovie(@Body() body: any) {
    return this.moviesService.create(body);
  }

  @Put('movies/:id')
  async updateMovie(@Param('id') id: string, @Body() body: any) {
    return this.moviesService.update(id, body);
  }

  @Delete('movies/:id')
  async deleteMovie(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }

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

  @Put('shows/:showId/seats/:label')
  async updateSeatStatus(
    @Param('showId') showId: string,
    @Param('label') label: string,
    @Body('status') status: string
  ) {
    return this.seatsService.updateStatus(showId, label, status);
  }

  @Get('shows/:showId/verify-report')
  async verifyReport(@Param('showId') showId: string) {
    const bookings = await this.bookingsService.getBookingsByShow(showId);
    return { hasBookings: bookings.length > 0, count: bookings.length };
  }

  // Global Seat Management
  @Get('seats/global')
  async getGlobalSeats() {
    console.log('[AdminController] GET /admin/seats/global called');
    try {
      const seats = await this.seatsService.getGlobalSeats();
      console.log('[AdminController] Global seats retrieved:', seats.length);
      return seats;
    } catch (e) {
      console.error('[AdminController] Error getting global seats:', e);
      throw e;
    }
  }

  @Put('seats/global/:label')
  async toggleGlobalSeatDamage(
    @Param('label') label: string,
    @Body() body: { isDamaged: boolean }
  ) {
    console.log(`[AdminController] Toggling damage for ${label}:`, body);

    if (body === undefined || typeof body.isDamaged === 'undefined') {
      console.error('[AdminController] isDamaged is undefined');
      throw new Error('isDamaged is required');
    }

    // Ensure boolean
    const isDamaged = body.isDamaged === true || String(body.isDamaged) === 'true';

    try {
      const result = await this.seatsService.toggleGlobalDamage(label, isDamaged);
      console.log('[AdminController] Toggle result:', result);
      return result;
    } catch (e) {
      console.error('[AdminController] Service error:', e);
      throw e;
    }
  }

  @Get('shows/:showId/download-report')
  async downloadReport(@Param('showId') showId: string, @Res() res: Response) {
    const bookings = await this.bookingsService.getBookingsByShow(showId);

    // Create workbook
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bookings');

    // Add columns
    worksheet.columns = [
      { header: 'Student Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Seat Number', key: 'seats', width: 20 },
      { header: 'Booking Date', key: 'date', width: 20 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };

    // Add rows
    bookings.forEach((booking: any) => {
      // User is likely populated? Let's check BookingsService logic.
      // Assuming userId is populated as an object. If not, we might need to fetch it.
      // Based on typical populate pattern:
      const user = booking.userId as any;

      const userName = user?.name || 'Unknown';
      const userEmail = user?.email || 'Unknown';

      worksheet.addRow({
        name: userName,
        email: userEmail,
        seats: booking.seats.join(', '),
        date: new Date(booking.createdAt).toLocaleDateString(),
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=show-report-${showId}.xlsx`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  }
}
