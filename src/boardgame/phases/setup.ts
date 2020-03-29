/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import shuffleUtil from "lodash/shuffle";
import random from "lodash/random";
import groupBy from "lodash/groupBy";

import flatten from "lodash/flatten";
import {
  WizardState,
  isSetRound,
  generateBlankRoundState,
} from "../WizardState";
import { playersRound, NumPlayers, PlayerID } from "../entities/players";
import { Card, Rank } from "../entities/cards";
import { Phase } from "./phase";

export function shuffle({ round }: WizardState): void {
  round!.deck = shuffleUtil(round!.deck);
}

export function handout(g: WizardState, ctx: Ctx): void {
  const { round, numCards, numPlayers, currentPlayer } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const players = playersRound(
    (currentPlayer + 1) % numPlayers,
    numPlayers as NumPlayers
  );

  // handout cards to players
  const hands = new Array(numPlayers).fill(0).map<Card[]>(() => []);
  new Array(numCards).fill(0).forEach(() => {
    players.forEach((player) => {
      const card = round.deck.pop();
      if (!card) throw new Error("deck seems to be empty");
      hands[player].push(card);
    });
  });
  // draw trump card
  if (round.deck.length > 0) {
    round.trump = round.deck.pop() ?? null;
  }

  // sort cards on each players hand
  const sortedHands = hands.map((hand) => {
    const groupedHand = groupBy(hand, (card) => {
      if (card.rank === Rank.Z || card.rank === Rank.N) return card.rank;
      return card.suit;
    });

    const sortedGroups = Object.entries(groupedHand)
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
      .map(([, cardGroup]) => cardGroup.sort((a, b) => a.rank - b.rank));
    return flatten(sortedGroups);
  });
  round.hands = sortedHands;

  ctx.events!.endPhase!();
}

function onBegin(g: WizardState): void {
  // delete trick
  g.trick = null;
  // reset round
  g.round = generateBlankRoundState(g.numPlayers);
  // set dealer
  if (!g.dealer) {
    // draw a dealer at the start of game
    g.dealer = random(0, g.numPlayers - 1) as PlayerID;
  } else {
    g.dealer = ((g.dealer + 1) % g.numPlayers) as PlayerID;
  }
}

function first(g: WizardState, ctx: Ctx): number {
  return ctx.playOrder.findIndex(
    (playerID) => playerID === g.dealer.toString()
  );
}

export const setup: PhaseConfig = {
  onBegin,
  moves: {
    shuffle,
    handout,
  },
  start: true,
  next: Phase.Bidding,
  turn: {
    order: {
      // returns playOrder index of dealer
      first,
    },
  },
};
