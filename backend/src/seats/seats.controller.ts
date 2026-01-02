import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SeatsService } from './seats.service';

type SeatOut = { id: string; row: string; number: number; status: string; bookedBy?: string };

@Controller('shows')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) { }

  @Get(':id/seats')
  async seats(@Param('id') id: string) {
    let seats = await this.seatsService.findByShow(id);

    if (!seats || seats.length === 0) {
      await this.seatsService.generateSeats(id);
      seats = await this.seatsService.findByShow(id);
    }

    // Check for malformed data but do not auto-regenerate to avoid loops
    const hasMissingId = seats && seats.some((s: any) => !s.seatLabel);
    if (hasMissingId) {
      console.warn(`[SeatsController] WARNING: Found seats without 'seatLabel' for show ${id}. Admin intervention required or manual regeneration.`);
    }

    if (!seats) throw new NotFoundException('Seats not found and could not be generated');

    // Convert to rows similar to frontend shape
    const rowsMap: Record<string, SeatOut[]> = {};
    seats.forEach((s: any) => {
      const out: SeatOut = { id: `${s.row}${s.number}`, row: s.row, number: s.number, status: s.status, bookedBy: s.bookedBy };
      rowsMap[s.row] = rowsMap[s.row] || [];
      rowsMap[s.row].push(out);
    });

    const rows = Object.keys(rowsMap).sort().map(name => ({ name, seats: rowsMap[name].sort((a, b) => a.number - b.number) }));
    return rows;
  }
}
