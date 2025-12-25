import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { SeatsService } from './seats.service';

type SeatOut = { id: string; row: string; number: number; status: string; bookedBy?: string };

@Controller('shows')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get(':id/seats')
  async seats(@Param('id') id: string) {
    const seats = await this.seatsService.findByShow(id);
    if (!seats) throw new NotFoundException('Seats not found for show');

    // Convert to rows similar to frontend shape
    const rowsMap: Record<string, SeatOut[]> = {};
    seats.forEach((s: any) => {
      const out: SeatOut = { id: `${s.row}${s.number}`, row: s.row, number: s.number, status: s.status, bookedBy: s.bookedBy };
      rowsMap[s.row] = rowsMap[s.row] || [];
      rowsMap[s.row].push(out);
    });

    const rows = Object.keys(rowsMap).sort().map(name => ({ name, seats: rowsMap[name].sort((a,b)=>a.number-b.number) }));
    return rows;
  }
}
