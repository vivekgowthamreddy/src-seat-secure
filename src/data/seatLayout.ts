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

export const hasCenterAisle = (rowName: string): boolean => {
  return ['M', 'N', 'O', 'P', 'Q', 'R'].includes(rowName);
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
        status: 'available',
      });
    }
    
    return {
      name: rowName,
      seats,
    };
  });
};

export const TOTAL_SEATS = ROWS.reduce((acc, row) => acc + getSeatsForRow(row), 0);
// A-L: 12 rows * 38 = 456 seats
// M-R: 6 rows * 34 = 204 seats
// Total: 660 seats
