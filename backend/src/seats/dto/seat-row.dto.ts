export class SeatItemDto {
  id: string;
  row: string;
  number: number;
  status: string;
  bookedBy?: string;
}

export class SeatRowDto {
  name: string;
  seats: SeatItemDto[];
}
