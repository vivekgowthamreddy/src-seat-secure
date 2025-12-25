import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Seat, SeatDocument } from '../seats/schemas/seat.schema';
import { Show, ShowDocument } from '../shows/schemas/show.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Seat.name) private seatModel: Model<SeatDocument>,
    @InjectModel(Show.name) private showModel: Model<ShowDocument>,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { showId, seats } = dto;

    // Validate show exists
    const show = await this.showModel.findById(showId).lean();
    if (!show) {
      throw new NotFoundException('Show not found');
    }

    // Check if seats are available
    const existingSeats = await this.seatModel.find({
      showId: new Types.ObjectId(showId),
      $or: seats.map(s => ({ id: s })),
    }).lean();

    const seatIds = existingSeats.map(s => s.id);
    const unavailableSeats = seats.filter(s => !seatIds.includes(s));

    if (unavailableSeats.length > 0) {
      throw new BadRequestException(`Seats not found: ${unavailableSeats.join(', ')}`);
    }

    const bookedSeats = existingSeats.filter(s => s.status === 'booked');
    if (bookedSeats.length > 0) {
      throw new ConflictException(`Seats already booked: ${bookedSeats.map(s => s.id).join(', ')}`);
    }

    // Calculate amount (simple: seats * show.price)
    const amount = seats.length * (show.price || 250);

    // Create booking
    const booking = new this.bookingModel({
      userId: new Types.ObjectId(userId),
      showId: new Types.ObjectId(showId),
      seats,
      status: 'confirmed',
      amount,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });

    const savedBooking = await booking.save();

    // Update seat status to booked
    await this.seatModel.updateMany(
      { showId: new Types.ObjectId(showId), id: { $in: seats } },
      { status: 'booked', bookedBy: userId },
    );

    // Update show bookedSeats count
    await this.showModel.findByIdAndUpdate(
      showId,
      { $inc: { bookedSeats: seats.length } },
    );

    return {
      id: savedBooking._id,
      userId: savedBooking.userId,
      showId: savedBooking.showId,
      seats: savedBooking.seats,
      status: savedBooking.status,
      amount: savedBooking.amount,
      createdAt: savedBooking.createdAt,
      expiresAt: savedBooking.expiresAt,
    };
  }

  async getUserBookings(userId: string) {
    const bookings = await this.bookingModel.find({ userId: new Types.ObjectId(userId) }).lean();
    return bookings.map(b => ({
      id: b._id,
      userId: b.userId,
      showId: b.showId,
      seats: b.seats,
      status: b.status,
      amount: b.amount,
      createdAt: b.createdAt,
      expiresAt: b.expiresAt,
    }));
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.bookingModel.findById(id).lean();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify ownership (user can only see their own bookings unless admin)
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException('Cannot access other users bookings');
    }

    return {
      id: booking._id,
      userId: booking.userId,
      showId: booking.showId,
      seats: booking.seats,
      status: booking.status,
      amount: booking.amount,
      createdAt: booking.createdAt,
      expiresAt: booking.expiresAt,
    };
  }

  async getAllBookings() {
    const bookings = await this.bookingModel.find().lean();
    return bookings.map(b => ({
      id: b._id,
      userId: b.userId,
      showId: b.showId,
      seats: b.seats,
      status: b.status,
      amount: b.amount,
      createdAt: b.createdAt,
      expiresAt: b.expiresAt,
    }));
  }

  async getBookingStats() {
    const totalBookings = await this.bookingModel.countDocuments();
    const confirmedBookings = await this.bookingModel.countDocuments({ status: 'confirmed' });
    const totalRevenue = await this.bookingModel.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }
}
