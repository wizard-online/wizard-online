import { PhaseConfig, Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import flatten from "lodash/flatten";

import { G, isSetRound, isSetTrick, blankTrick } from "../G";
import { canPlayCard, getSuitsInHand, getTrickWinner } from "../entities/cards";

function endTrick(g: G): void {
  const { round, trick } = g;
  if (!isSetRound(round)) {
    throw Error("round is not set");
  }
  if (!isSetTrick(trick)) {
    throw Error("trick is not set");
  }

  // check that all players have same amount of cards
  if (!round.hands.every((hand) => hand.length === round.hands[0].length)) {
    throw Error(
      "players have not equal amount of cards at the end of the trick"
    );
  }
  const [, winnerPlayerId] = getTrickWinner(
    trick.cards,
    round.trump?.suit || null
  );
  round.trickCount![parseInt(winnerPlayerId, 10)] += 1;
  // eslint-disable-next-line no-param-reassign
  g.trick = null;
}

function onEnd({ round, game }: G, ctx: Ctx): void {
  if (!isSetRound(round)) {
    throw Error("round is not set");
  }
  if (flatten(round.hands).length > 0) {
    throw Error("hands are not empty when attempting to end the round");
  }
  // check if game is finished
  const incNumCards = game.numCards + 1;
  if (incNumCards * ctx.numPlayers > 60) {
    ctx.events!.endGame!();
  }
  // eslint-disable-next-line no-param-reassign
  game.numCards = incNumCards;
}

export const play: PhaseConfig = {
  moves: {
    play(g: G, ctx: Ctx, cardIndex: number): void | "INVALID_MOVE" {
      const { round, trick } = g;
      if (!isSetRound(round)) {
        throw Error("round is not set");
      }
      if (!isSetTrick(trick)) {
        throw Error("trick is not set");
      }
      const hand = round.hands[parseInt(ctx.currentPlayer, 10)];
      if (cardIndex < 0 || cardIndex >= hand.length) {
        return INVALID_MOVE;
      }
      const card = hand[cardIndex];
      if (!canPlayCard(card, getSuitsInHand(hand), trick.lead)) {
        return INVALID_MOVE;
      }

      // as first player, init trick
      if (!g.trick) {
        // eslint-disable-next-line no-param-reassign
        g.trick = blankTrick();
      }
      if (!round.trickCount) {
        // eslint-disable-next-line no-param-reassign
        round.trickCount = Array(5).fill(0);
      }
      // play card
      hand.splice(cardIndex, 1);
      trick.cards.push([card, ctx.currentPlayer]);
      // as last player, find trick taker, increment trick count, and cleanup trick
      if (trick.cards.length === ctx.numPlayers) {
        endTrick(g);
      }
    },
  },
  endIf({ round }: G) {
    if (!isSetRound(round)) {
      throw Error("round is not set");
    }
    return flatten(round.hands).length === 0;
  },
  next: "setup",
  onEnd,
};
