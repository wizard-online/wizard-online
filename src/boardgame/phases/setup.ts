/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import shuffle from "lodash/shuffle";

import { G } from "../G";
import { playersRound } from "../entities/players";
import { Card } from "../entities/cards";

export const setup: PhaseConfig = {
  onBegin(g: G) {
    g.deck = shuffle(g.deck);
  },
  moves: {
    shuffle(g: G) {
      g.deck = shuffle(g.deck);
    },
    handout(g: G, ctx: Ctx) {
      const players = playersRound(
        (parseInt(ctx.currentPlayer, 10) + 1) % ctx.numPlayers,
        ctx.numPlayers
      );

      const hands = Array(ctx.numPlayers)
        .fill(0)
        .map<Card[]>(() => []);
      Array(g.numCardsOnHand)
        .fill(0)
        .forEach(() => {
          players.forEach((player) => {
            const card = g.deck.pop();
            if (!card) throw Error("deck seems to be empty");
            hands[player].push(card);
          });
        });
      g.hands = hands;
      ctx.events!.endPhase!();
    },
  },
  start: true,
  next: "predict",
};
