import { Ctx, PlayerID } from "boardgame.io";
import { Card, generateCardDeck } from "./entities/cards";

export interface G {
  numCardsOnHand: number;
  bids: Array<number | null>;
  hands: Card[][];
  trick: [Card, PlayerID][] | null;
  trump: Card | null;
  lead: Card | null;
  deck: Card[];
}

export const defaultG = (ctx: Ctx): G => {
  return {
    numCardsOnHand: 3,
    bids: Array(ctx.numPlayers).fill(null),
    hands: Array(ctx.numPlayers).fill(null),
    trick: null,
    trump: null,
    lead: null,
    deck: generateCardDeck(),
  };
};
