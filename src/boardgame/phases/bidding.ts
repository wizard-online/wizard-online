/* eslint-disable no-param-reassign */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import groupBy from "lodash/groupBy";
import flatten from "lodash/flatten";
import { WizardState, isSetRound } from "../WizardState";
import { isValidBid } from "../util/bid";
import { Phase } from "./phase";
import { Rank } from "../entities/cards";

export function bid(
  { round, numCards, currentPlayer }: WizardState,
  ctx: Ctx,
  numberOfTricks: number
): "INVALID_MOVE" | void {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (!isValidBid(numberOfTricks, numCards, round.bids, currentPlayer)) {
    return INVALID_MOVE;
  }

  round.bids[Number.parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
  ctx.events!.endTurn!();
}

export function sortCards({ currentPlayer, round }: WizardState): void {
  if (!round) return;

  const hand = round.hands[currentPlayer];
  // group cards by suit / N / Z
  const groupedHand = groupBy(hand, (card) => {
    if (card.rank === Rank.Z || card.rank === Rank.N) return card.rank;
    return card.suit;
  });

  const sortedGroups = Object.entries(groupedHand)
    // sort groups in this order: [Ns, ... non-trump suits sorted by num card, trump suit, Zs]
    .sort(([keyA, cardsA], [keyB, cardsB]) => {
      // always sort N left and Z right
      if (keyA === Rank.N.toString() || keyB === Rank.Z.toString()) return -1;
      if (keyA === Rank.Z.toString() || keyB === Rank.Z.toString()) return 1;
      // always sort trump beside Z
      if (keyA === round.trump?.suit) return 1;
      if (keyB === round.trump?.suit) return -1;
      // sort by number of cards of color
      return cardsA.length - cardsB.length;
    })
    // sort cards in each group by rank
    .map(([, cardGroup]) => cardGroup.sort((a, b) => a.rank - b.rank));
  // set sorted hand to state
  round.hands[currentPlayer] = flatten(sortedGroups);
}

function endIf({ round }: WizardState): boolean {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return !round.bids.includes(null);
}

export const bidding: PhaseConfig = {
  moves: {
    bid,
    sortCards,
  },
  endIf,
  next: Phase.Playing,
};
