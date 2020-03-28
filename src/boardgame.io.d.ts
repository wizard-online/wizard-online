/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ctx } from "boardgame.io";

declare module "boardgame.io" {
  export interface Ctx {
    // enhanced by events plugin
    events?: EventsAPI;
    // enhanced by player plugin
    player?: PlayerAPI;
    // enhanced by random plugin
    random?: RandomAPI;
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

  export interface PlayerAPI {
    get(): any;
    set(value: any): any;
    opponent?: {
      get(): any;
      set(value: any): any;
    };
  }

  export interface RandomAPI {
    D4(): number;
    D4(diceCount: number): number[];
    D6(): number;
    D6(diceCount: number): number[];
    D10(): number;
    D10(diceCount: number): number[];
    D12(): number;
    D12(diceCount: number): number[];
    D20(): number;
    D20(diceCount: number): number[];
    Die(spotvalue?: number): number;
    Die(spotvalue: number, diceCount: number): number[];
    Number(): number;
    Shuffle<T>(deck: T[]): T[];
  }
}
