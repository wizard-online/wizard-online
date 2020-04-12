/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import shuffleUtil from "lodash/shuffle";
import random from "lodash/random";

import {
  WizardState,
  isSetRound,
  generateBlankRoundState,
} from "../WizardState";
import { playersRound } from "../entities/players.utils";
import { Card, Rank, Suit } from "../entities/cards";
import { Phase } from "./phase";
import { onBeginTurn } from "../turn";
import { NumPlayers, PlayerID } from "../entities/players";

export function shuffleMove(wizardState: WizardState): void {
  // shuffle deck
  wizardState.round!.deck = shuffleUtil(wizardState.round!.deck);
}

export function handoutMove(wizardState: WizardState, ctx: Ctx): void {
  const { round, numCards, numPlayers, currentPlayer } = wizardState;
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
  round.hands = hands;

  // draw trump card
  let trumpCard: Card | null = null;
  let trumpSuit: Suit | null | undefined = null;

  if (round.deck.length > 0) {
    trumpCard = round.deck.pop() ?? null;
    trumpSuit = trumpCard?.suit ?? null;
    if (trumpCard?.rank === Rank.N) {
      trumpSuit = null;
    }
    if (trumpCard?.rank === Rank.Z) {
      trumpSuit = undefined;
    }
  }

  round.trump = { card: trumpCard, suit: trumpSuit };

  // go to next phase
  if (trumpSuit === undefined) {
    ctx.events!.setPhase!(Phase.SelectingTrump);
  } else {
    ctx.events!.endPhase!();
  }
}

function setupRound(wizardState: WizardState): void {
  // setup (or reset) round
  if (!wizardState.round || wizardState.trick) {
    wizardState.round = generateBlankRoundState(wizardState.numPlayers);
  }
  // reset trick
  wizardState.trick = null;
}

function onBegin(g: WizardState): void {
  // set dealer
  if (g.dealer >= 0) {
    g.dealer = ((g.dealer + 1) % g.numPlayers) as PlayerID;
  } else {
    // draw a dealer at the start of game
    g.dealer = random(0, g.numPlayers - 1) as PlayerID;
  }
}

function first(g: WizardState, ctx: Ctx): number {
  return ctx.playOrder.findIndex(
    (playerID) => playerID === g.dealer.toString()
  );
}

function shuffle(wizardState: WizardState): void {
  setupRound(wizardState);
  shuffleMove(wizardState);
}

function handout(wizardState: WizardState, ctx: Ctx): void {
  setupRound(wizardState);
  handoutMove(wizardState, ctx);
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
      next(wizardState: WizardState, ctx: Ctx) {
        const currentPlayerIndex = ctx.playOrder.findIndex(
          (playerID) => playerID === ctx.currentPlayer
        );
        return (currentPlayerIndex + 1) % ctx.numPlayers;
      },
    },
    onBegin: onBeginTurn,
  },
};
