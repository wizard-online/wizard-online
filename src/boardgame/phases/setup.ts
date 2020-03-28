/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import shuffleUtil from "lodash/shuffle";
import random from "lodash/random";

import { G, isSetRound, blankRound } from "../G";
import { playersRound } from "../entities/players";
import { Card } from "../entities/cards";

export function shuffle({ round }: G): void {
  round!.deck = shuffleUtil(round!.deck);
}

export function handout(g: G, ctx: Ctx): void {
  const { round, game } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const players = playersRound(
    (Number.parseInt(ctx.currentPlayer, 10) + 1) % ctx.numPlayers,
    ctx.numPlayers
  );

  const hands = new Array(ctx.numPlayers).fill(0).map<Card[]>(() => []);
  new Array(game.numCards).fill(0).forEach(() => {
    players.forEach((player) => {
      const card = round.deck.pop();
      if (!card) throw new Error("deck seems to be empty");
      hands[player].push(card);
    });
  });

  round.hands = hands;
  const trump = round.deck.pop();
  if (!trump) throw new Error("deck seems to be empty");
  round.trump = trump;

  ctx.events!.endPhase!();
}

function onBegin(g: G, ctx: Ctx): void {
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
      (Number.parseInt(g.game.dealer, 10) + 1) %
      ctx.numPlayers
    ).toString();
  }
}

function first(g: G, ctx: Ctx): number {
  return ctx.playOrder.findIndex((playerID) => playerID === g.game.dealer);
}

export const setup: PhaseConfig = {
  onBegin,
  moves: {
    shuffle,
    handout,
  },
  start: true,
  next: "bidding",
  turn: {
    order: {
      // returns playOrder index of dealer
      first,
    },
  },
};
