import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Seat, SeatDocument } from '../seats/schemas/seat.schema';
import { Show, ShowDocument } from '../shows/schemas/show.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Seat.name) private seatModel: Model<SeatDocument>,
    @InjectModel(Show.name) private showModel: Model<ShowDocument>,
    private usersService: UsersService,
  ) { }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const { showId, seats } = dto;

    // Validate user gender
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Validate show exists
    const show = await this.showModel.findById(showId).lean();
    if (!show) {
      throw new NotFoundException('Show not found');
    }

    if (show.category !== 'all') {
      if (show.category === 'boys' && user.gender !== 'male') {
        throw new BadRequestException('This show is only for Boys');
      }
      if (show.category === 'girls' && user.gender !== 'female') {
        throw new BadRequestException('This show is only for Girls');
      }
    }

    // Check if user already booked a seat for this show
    const existingBooking = await this.bookingModel.findOne({
      userId: new Types.ObjectId(userId),
      showId: new Types.ObjectId(showId),
      status: 'confirmed'
    });

    if (existingBooking) {
      throw new ConflictException('You have already booked a seat for this show. Limit is 1 seat per student.');
    }

    if (seats.length > 1) {
      throw new BadRequestException('You can only book 1 seat per show.');
    }

    // Check if seats are available
    // 'seats' array contains labels like 'A1', 'B2', etc.
    const existingSeats = await this.seatModel.find({
      showId: new Types.ObjectId(showId),
      seatLabel: { $in: seats }
    }).lean();

    const foundSeatLabels = existingSeats.map(s => s.seatLabel);
    const missingSeats = seats.filter(s => !foundSeatLabels.includes(s));

    if (missingSeats.length > 0) {
      throw new BadRequestException(`Seats not found: ${missingSeats.join(', ')}`);
    }

    const bookedSeats = existingSeats.filter(s => s.status === 'booked');
    if (bookedSeats.length > 0) {
      throw new ConflictException(`Seat ${bookedSeats[0].seatLabel} is already booked.`);
    }

    // Double check with an atomic update attempt if needed in high concurrency, 
    // but for now this check + the updateMany below is better than before. 
    // Note: To be fully atomic, we should try to update where status=available and see if nModified matches.

    // Create booking
    // Amount is free
    const amount = 0;

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
      { showId: new Types.ObjectId(showId), seatLabel: { $in: seats } },
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
    const bookings = await this.bookingModel.find({ userId: new Types.ObjectId(userId) })
      .populate({ path: 'showId', populate: { path: 'movieId' } })
      .lean();
    return bookings.map(b => {
      const showObj = b.showId && typeof b.showId === 'object' && '_id' in b.showId ? { ...(b.showId as any), id: (b.showId as any)._id } : b.showId;
      if (showObj && typeof showObj === 'object' && showObj.movieId && typeof showObj.movieId === 'object' && '_id' in showObj.movieId) {
        showObj.movieId = { ...showObj.movieId, id: showObj.movieId._id };
      }
      return {
        id: b._id,
        userId: b.userId,
        showId: showObj,
        seats: b.seats,
        status: b.status,
        amount: b.amount,
        createdAt: b.createdAt,
        expiresAt: b.expiresAt,
      };
    });
  }

  async getBookingById(id: string, userId: string) {
    const booking = await this.bookingModel.findById(id)
      .populate({ path: 'showId', populate: { path: 'movieId' } })
      .lean();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify ownership (user can only see their own bookings unless admin)
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException('Cannot access other users bookings');
    }

    const showObj = booking.showId && typeof booking.showId === 'object' && '_id' in booking.showId ? { ...(booking.showId as any), id: (booking.showId as any)._id } : booking.showId;
    if (showObj && typeof showObj === 'object' && showObj.movieId && typeof showObj.movieId === 'object' && '_id' in showObj.movieId) {
      showObj.movieId = { ...showObj.movieId, id: showObj.movieId._id };
    }

    return {
      id: booking._id,
      userId: booking.userId,
      showId: showObj,
      seats: booking.seats,
      status: booking.status,
      amount: booking.amount,
      createdAt: booking.createdAt,
      expiresAt: booking.expiresAt,
    };
  }

  async getAllBookings() {
    const bookings = await this.bookingModel.find()
      .populate({ path: 'showId', populate: { path: 'movieId' } })
      .lean();
    return bookings.map(b => {
      const showObj = b.showId && typeof b.showId === 'object' && '_id' in b.showId ? { ...(b.showId as any), id: (b.showId as any)._id } : b.showId;
      if (showObj && typeof showObj === 'object' && showObj.movieId && typeof showObj.movieId === 'object' && '_id' in showObj.movieId) {
        showObj.movieId = { ...showObj.movieId, id: showObj.movieId._id };
      }
      return {
        id: b._id,
        userId: b.userId,
        showId: showObj,
        seats: b.seats,
        status: b.status,
        amount: b.amount,
        createdAt: b.createdAt,
        expiresAt: b.expiresAt,
      };
    });
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

  async getBookingsByShow(showId: string) {
    return this.bookingModel.find({ showId: new Types.ObjectId(showId) })
      .populate('userId', 'name email')
      .populate({ path: 'showId', populate: { path: 'movieId' } })
      .sort({ createdAt: -1 })
      .lean();
  }
}
