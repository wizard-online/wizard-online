import { PlayerID } from "./players";

/**
 * checks if a given bid amount is valid acording to previous bids.
 * Only relevant for last player in bidding round.
 *
 * @export
 * @param {number} bidValue
 * @param {number} numCards
 * @param {((number | null)[])} bids
 * @param {PlayerID} currentPlayer
 * @returns {boolean}
 */
export function isValidBid(
  bidValue: number,
  numCards: number,
  bids: (number | null)[],
  currentPlayer: PlayerID
): boolean {
  if (bidValue < 0 || bidValue > numCards) {
    return false;
  }

  const isNotFirstRound = numCards > 1;
  const isLastPlayer =
    bids.filter((score, i) => i !== currentPlayer && score === null).length ===
    0;
  const isTotalPredictionEven =
    [bidValue, ...bids].reduce((sum, value) => (sum || 0) + (value || 0), 0) ===
    numCards;
  if (isNotFirstRound && isLastPlayer && isTotalPredictionEven) {
    return false;
  }
  return true;
}

export function getBidsMismatch(bids: number[], numCards: number): number {
  return bids.reduce((a, b) => a + b, 0) - numCards;
}
