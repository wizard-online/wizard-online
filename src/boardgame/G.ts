import { Ctx } from "boardgame.io";
import { Card, generateCardDeck } from "./entities/cards";

export interface G {
  numCardsOnHand: number;
  score: Array<number | null>;
  hands: Card[][];
  trump: Card | null;
  deck: Card[];
}

export const defaultG = (ctx: Ctx): G => {
  return {
    numCardsOnHand: 3,
    score: Array(ctx.numPlayers).fill(null),
    hands: Array(ctx.numPlayers).fill(null),
    trump: null,
    deck: generateCardDeck(),
  };
};
