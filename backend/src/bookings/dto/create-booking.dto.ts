import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  showId: string;

  @IsArray()
  @ArrayMinSize(1)
  seats: string[];
}

export class BookingResponseDto {
  id: string;
  userId: string;
  showId: string;
  seats: string[];
  status: string;
  amount: number;
  createdAt: Date;
  expiresAt: Date;
}
