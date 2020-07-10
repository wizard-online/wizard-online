/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";

import { fromPairs } from "lodash";
import {
  WizardState,
  isSetRound,
  generateBlankRoundState,
  HandMeta,
} from "../WizardState";
import { playersRound } from "../entities/players.utils";
import { Card, Rank, Suit, allSuits, allRanks } from "../entities/cards";
import { Phase } from "./phase";
import { onBeginTurn } from "../turn";
import { NumPlayers, PlayerID } from "../entities/players";

export function shuffleMove(wizardState: WizardState, ctx: Ctx): void {
  // shuffle deck
  wizardState.round!.deck = ctx.random!.Shuffle(wizardState.round!.deck);
}

export function handoutMove(wizardState: WizardState, ctx: Ctx): void {
  const { round, roundIndex, rounds, numPlayers, currentPlayer } = wizardState;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const players = playersRound(
    (currentPlayer + 1) % numPlayers,
    numPlayers as NumPlayers
  );

  // handout cards to players
  const hands = new Array(numPlayers).fill(0).map<(Card | null)[]>(() => []);
  new Array(rounds[roundIndex]).fill(0).forEach(() => {
    players.forEach((player) => {
      const card = round.deck.pop();

      if (card === undefined) throw new Error("deck seems to be empty");
      hands[player].push(card);
    });
  });
  round.hands = hands;

  // create hand meta data
  const handsMeta = hands.map((hand) => {
    const suits = fromPairs(
      allSuits.map((suit) => {
        const cardsOfSuit = hand.filter(
          (card) =>
            card?.suit === suit &&
            card?.rank !== Rank.N &&
            card?.rank !== Rank.Z
        );
        return [suit, cardsOfSuit.length];
      })
    );
    const ranks = fromPairs(
      allRanks.map((rank) => {
        const cardsOfRank = hand.filter((card) => card?.rank === rank);
        return [rank, cardsOfRank.length];
      })
    );
    return {
      total: hand.length,
      suits,
      ranks,
    } as HandMeta;
  });
  round.handsMeta = handsMeta;

  // draw trump card
  let trumpCard: Card | undefined;
  let trumpSuit: Suit | null | undefined = null;

  if (round.deck.length > 0) {
    trumpCard = round.deck.pop() ?? undefined;
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

function setupRound(wizardState: WizardState, ctx: Ctx): void {
  // increment roundIndex if not first round
  if (wizardState.round?.isComplete) {
    wizardState.roundIndex += 1;
  }
  // setup (or reset) round
  if (!wizardState.round || wizardState.trick) {
    wizardState.round = generateBlankRoundState(ctx, wizardState.numPlayers);
  }
  // reset trick
  wizardState.trick = null;
}

function onBegin(g: WizardState, ctx: Ctx): void {
  // set dealer
  if (g.dealer >= 0) {
    g.dealer = ((g.dealer + 1) % g.numPlayers) as PlayerID;
  } else {
    // draw a dealer at the start of game
    g.dealer = (ctx.random!.Die(g.numPlayers) - 1) as PlayerID;
  }
}

function first(g: WizardState, ctx: Ctx): number {
  return ctx.playOrder.findIndex(
    (playerID) => playerID === g.dealer.toString()
  );
}

function shuffle(wizardState: WizardState, ctx: Ctx): void {
  setupRound(wizardState, ctx);
  shuffleMove(wizardState, ctx);
}

function handout(wizardState: WizardState, ctx: Ctx): void {
  setupRound(wizardState, ctx);
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
