import { MatchSeat } from "../services/api.service";

export function sortMatchSeats(seats: MatchSeat[]): MatchSeat[] {
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
