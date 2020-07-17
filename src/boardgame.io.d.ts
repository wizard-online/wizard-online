/* eslint-disable @typescript-eslint/no-explicit-any */
import { State } from "boardgame.io";

declare module "boardgame.io" {
  export interface State {
    moves: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [move: string]: Function;
    };
    playerID: string;
    gameMetadata: GameMetadatum[];
  }

  export interface GameMetadatum {
    id: number;
    name: string;
  }

  export interface EventsAPI {
    endGame?(...args: any[]): any;
    endPhase?(...args: any[]): any;
    endStage?(...args: any[]): any;
    endTurn?(...args: any[]): any;
    pass?(...args: any[]): any;
    setActivePlayers?(...args: any[]): any;
    setPhase?(...args: any[]): any;
    setStage?(...args: any[]): any;
  }
}
