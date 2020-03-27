/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import shuffle from "lodash/shuffle";
import random from "lodash/random";

import { G, isSetRound, blankRound } from "../G";
import { playersRound } from "../entities/players";
import { Card } from "../entities/cards";

export const setup: PhaseConfig = {
  onBegin(g: G, ctx: Ctx) {
    // delete trick
    g.trick = null;
    // reset round
    g.round = blankRound(ctx);
    // set dealer
    if (!g.game.dealer) {
      // draw a dealer at the start of game
      g.game.dealer = random(0, ctx.numPlayers - 1).toString();
    } else {
      g.game.dealer = (
        (parseInt(g.game.dealer, 10) + 1) %
        ctx.numPlayers
      ).toString();
    }

    // set dealer's turn
    // ctx.events!.endTurn!({ next: g.game.dealer });
  },
  moves: {
    shuffle({ round }: G) {
      round!.deck = shuffle(round!.deck);
    },
    handout(g: G, ctx: Ctx) {
      const { round, game } = g;
      if (!isSetRound(round)) {
        throw Error("round is not set");
      }

      const players = playersRound(
        (parseInt(ctx.currentPlayer, 10) + 1) % ctx.numPlayers,
        ctx.numPlayers
      );

      const hands = Array(ctx.numPlayers)
        .fill(0)
        .map<Card[]>(() => []);
      Array(game.numCards)
        .fill(0)
        .forEach(() => {
          players.forEach((player) => {
            const card = round.deck.pop();
            if (!card) throw Error("deck seems to be empty");
            hands[player].push(card);
          });
        });

      round.hands = hands;
      const trump = round.deck.pop();
      if (!trump) throw Error("deck seems to be empty");
      round.trump = trump;

      ctx.events!.endPhase!();
    },
  },
  start: true,
  next: "bidding",
  turn: {
    order: {
      // returns playOrder index of dealer
      first(g: G, ctx: Ctx) {
        return ctx.playOrder.findIndex(
          (playerID) => playerID === g.game.dealer
        );
      },
    },
  },
};
