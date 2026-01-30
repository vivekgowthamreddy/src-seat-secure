// SAC Auditorium Seating Layout based on official PDF
// 18 rows (A-R), up to 38 seats per row
// Center aisle between seats 17 and 18 for rows M-R

export type SeatStatus = 'available' | 'booked' | 'selected' | 'unavailable' | 'damaged';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  bookedBy?: string;
}

export interface Row {
  name: string;
  seats: Seat[];
}

// Rows A-L have 38 seats each
// Rows M-R have 34 seats each (17 on each side with center aisle for CABIN)

export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

export const getSeatsForRow = (rowName: string): number => {
  if (['M', 'N', 'O', 'P', 'Q', 'R'].includes(rowName)) {
    return 34; // Rows with center aisle/CABIN
  }
  return 38;
};

// Returns the seat number after which there is a visual gap
export const getGapPosition = (rowName: string): number => {
  if (['M', 'N', 'O', 'P', 'Q', 'R'].includes(rowName)) {
    return 17; // Gap after seat 17 for M-R (where Cabin is)
  }
  return 19; // Gap after seat 19 for A-L
};

export const getGapClass = (rowName: string): string => {
  if (['M', 'N', 'O', 'P', 'Q', 'R'].includes(rowName)) {
    // Gap covers 2 missing seats on left + 2 missing on right + standard aisle
    // (SeatWidth 24px + Gap 4px) * 2 * 2 + Aisle 32px = 56 + 56 + 32 = 144px -> w-36
    return 'w-36';
  }
  return 'w-8';
}

export const hasCenterAisle = (rowName: string): boolean => {
  // All rows now have a visual gap/aisle
  return true;
};

export const generateSeatLayout = (): Row[] => {
  return ROWS.map((rowName) => {
    const seatCount = getSeatsForRow(rowName);
    const seats: Seat[] = [];

    for (let i = 1; i <= seatCount; i++) {
      seats.push({
        id: `${rowName}${i}`,
        row: rowName,
        number: i,
        status: rowName === 'R' ? 'unavailable' : 'available',
      });
    }

    return {
      name: rowName,
      seats,
    };
  });
};

export const TOTAL_SEATS = 600;
// A-L: 12 rows * 38 = 456 seats
// M-Q: 5 rows * 34 = 170 seats
// Total count adjusted to 600 for display (last row R blocked)
