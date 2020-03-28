/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import shuffleUtil from "lodash/shuffle";
import random from "lodash/random";

import { G, isSetRound, blankRound } from "../G";
import { playersRound, NumPlayers, PlayerID } from "../entities/players";
import { Card } from "../entities/cards";

export function shuffle({ round }: G): void {
  round!.deck = shuffleUtil(round!.deck);
}

export function handout(g: G, ctx: Ctx): void {
  const {
    round,
    game: { numCards, numPlayers, currentPlayer },
  } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const players = playersRound(
    (currentPlayer + 1) % numPlayers,
    numPlayers as NumPlayers
  );

  const hands = new Array(numPlayers).fill(0).map<Card[]>(() => []);
  new Array(numCards).fill(0).forEach(() => {
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

function onBegin(g: G): void {
  // delete trick
  g.trick = null;
  // reset round
  g.round = blankRound(g.game.numPlayers);
  // set dealer
  if (!g.game.dealer) {
    // draw a dealer at the start of game
    g.game.dealer = random(0, g.game.numPlayers - 1) as PlayerID;
  } else {
    g.game.dealer = ((g.game.dealer + 1) % g.game.numPlayers) as PlayerID;
  }
}

function first(g: G, ctx: Ctx): number {
  return ctx.playOrder.findIndex(
    (playerID) => playerID === g.game.dealer.toString()
  );
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
