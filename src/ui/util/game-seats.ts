import { GameSeat } from "../services/api.service";

export function sortGameSeats(seats: GameSeat[]): GameSeat[] {
  return seats.sort((a, b) => {
    if (!a.name) {
      return 1;
    }
    if (!b.name) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  });
}
