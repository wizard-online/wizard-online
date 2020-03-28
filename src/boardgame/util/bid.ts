export function isValidBid(
  bidValue: number,
  numCards: number,
  bids: (number | null)[],
  currentPlayer: string
): boolean {
  if (bidValue < 0 || bidValue > numCards) {
    return false;
  }

  const isNotFirstRound = numCards > 1;
  const isLastPlayer =
    bids.filter(
      (score, i) => i !== Number.parseInt(currentPlayer, 10) && score === null
    ).length === 0;
  const isTotalPredictionEven =
    [bidValue, ...bids].reduce((sum, value) => (sum || 0) + (value || 0), 0) ===
    numCards;
  if (isNotFirstRound && isLastPlayer && isTotalPredictionEven) {
    return false;
  }
  return true;
}
