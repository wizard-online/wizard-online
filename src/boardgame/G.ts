import { Ctx } from "boardgame.io";
import { Card, generateCardDeck } from "./entities/cards";

export interface G {
  numCardsOnHand: number;
  score: Array<number | null>;
  hands: Card[][];
  deck: Card[];
}

export const defaultG = (ctx: Ctx): G => ({
  numCardsOnHand: 3,
  score: Array(ctx.numPlayers).fill(null),
  hands: Array(ctx.numPlayers).fill(null),
  deck: generateCardDeck(),
});
