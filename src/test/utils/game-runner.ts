import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState } from "../../shared/WizardState";
import { NumPlayers, PlayerID } from "../../shared/entities/players";
import { Phase } from "../../shared/phases/phase";
import { Card, Suit } from "../../shared/entities/cards";
import { nextPlayer } from "../../shared/entities/players.utils";
import { generateCtx } from "./ctx";
import { bid, bidding } from "../../shared/phases/bidding";
import { play, playing } from "../../shared/phases/playing";
import {
  selectTrump,
  selectingTrump,
} from "../../shared/phases/selecting-trump";
import { setup } from "../../shared/phases/setup";
import { PhaseConfig } from "boardgame.io";

const phaseMap: Record<string, PhaseConfig> = {
  [Phase.Bidding]: bidding,
  [Phase.Playing]: playing,
  [Phase.SelectingTrump]: selectingTrump,
  [Phase.Setup]: setup,
};

export class GameRunner {
  private g: WizardState;
  private numPlayers: NumPlayers;
  private _roundComplete = false;

  constructor(initialState: WizardState, numPlayers: NumPlayers) {
    this.g = initialState;
    this.numPlayers = numPlayers;
  }

  get state(): Readonly<WizardState> {
    return this.g;
  }

  get currentPlayer(): PlayerID {
    return this.g.currentPlayer;
  }

  get phase(): Phase {
    return this.g.phase;
  }

  get isRoundComplete(): boolean {
    return this._roundComplete;
  }

  bid(playerID: PlayerID, amount: number): void {
    this._assertCurrentPlayer(playerID);
    const ctx = this._buildCtx();
    const endTurnSpy = jest.fn();
    const endPhaseSpy = jest.fn();
    ctx.events = { ...ctx.events, endTurn: endTurnSpy, endPhase: endPhaseSpy };

    const result = bid(this.g, ctx, amount);
    if (result === INVALID_MOVE) {
      throw new Error("Move returned INVALID_MOVE");
    }

    this._handleTurnEnd(endTurnSpy, endPhaseSpy);
  }

  play(playerID: PlayerID, card: Card): void {
    this._assertCurrentPlayer(playerID);
    const ctx = this._buildCtx();
    const endTurnSpy = jest.fn();
    const endPhaseSpy = jest.fn();
    ctx.events = { ...ctx.events, endTurn: endTurnSpy, endPhase: endPhaseSpy };

    // Find card index in filtered (non-null) hand
    const rawHand = this.g.round!.hands[playerID];
    const filteredHand = rawHand.filter((c): c is Card => c !== null);
    const filteredIndex = filteredHand.findIndex(
      (c) => c.suit === card.suit && c.rank === card.rank
    );
    if (filteredIndex === -1) {
      throw new Error(
        `Card ${card.suit}/${card.rank} not found in player ${playerID}'s hand`
      );
    }

    const result = play(this.g, ctx, filteredIndex);
    if (result === INVALID_MOVE) {
      throw new Error("Move returned INVALID_MOVE");
    }

    this._handleTurnEnd(endTurnSpy, endPhaseSpy);
  }

  selectTrump(playerID: PlayerID, suit: Suit): void {
    this._assertCurrentPlayer(playerID);
    const ctx = this._buildCtx();
    const endTurnSpy = jest.fn();
    const endPhaseSpy = jest.fn();
    ctx.events = { ...ctx.events, endTurn: endTurnSpy, endPhase: endPhaseSpy };

    const result = selectTrump(this.g.round ? this.g : this.g, ctx, suit);
    if (result === INVALID_MOVE) {
      throw new Error("Move returned INVALID_MOVE");
    }

    this._handleTurnEnd(endTurnSpy, endPhaseSpy);
  }

  private _assertCurrentPlayer(playerID: PlayerID): void {
    if (playerID !== this.g.currentPlayer) {
      throw new Error(
        `Cannot move: it is player ${this.g.currentPlayer}'s turn, not player ${playerID}'s`
      );
    }
  }

  private _buildCtx() {
    return generateCtx({
      numPlayers: this.numPlayers,
      currentPlayer: this.g.currentPlayer.toString(),
      phase: this.g.phase,
      playOrder: Array.from({ length: this.numPlayers }, (_, i) =>
        i.toString()
      ),
    });
  }

  private _handleTurnEnd(
    endTurnSpy: jest.Mock,
    endPhaseSpy: jest.Mock
  ): void {
    const endTurnCalled = endTurnSpy.mock.calls.length > 0;
    const endPhaseCalled = endPhaseSpy.mock.calls.length > 0;

    if (endTurnCalled) {
      const args = endTurnSpy.mock.calls[0];
      if (args.length > 0 && args[0] && typeof args[0].next === "string") {
        this.g.currentPlayer = parseInt(args[0].next, 10) as PlayerID;
      } else {
        this.g.currentPlayer = nextPlayer(
          this.g.currentPlayer,
          this.numPlayers
        );
      }
    }

    if (endPhaseCalled && !endTurnCalled) {
      const currentPhaseConfig = phaseMap[this.g.phase];
      if (currentPhaseConfig && currentPhaseConfig.next) {
        this.g.phase = currentPhaseConfig.next as Phase;
      }
    }

    this._checkPhaseTransition();
  }

  private _checkPhaseTransition(): void {
    const currentPhaseConfig = phaseMap[this.g.phase];
    if (!currentPhaseConfig || !currentPhaseConfig.endIf) {
      return;
    }

    const ctx = this._buildCtx();

    if (currentPhaseConfig.endIf(this.g, ctx)) {
      if (currentPhaseConfig.onEnd) {
        currentPhaseConfig.onEnd(this.g, ctx);
      }

      if (this.g.phase === Phase.Playing) {
        this._roundComplete = true;
        return;
      }

      if (currentPhaseConfig.next) {
        this.g.phase = currentPhaseConfig.next as Phase;
        const nextPhaseConfig = phaseMap[this.g.phase];
        if (nextPhaseConfig && nextPhaseConfig.onBegin) {
          nextPhaseConfig.onBegin(this.g, ctx);
        }
      }
    }
  }
}
