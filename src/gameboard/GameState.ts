import { State } from "boardgame.io";
import { G } from "../boardgame/G";

export interface GameState extends State {
  G: G;
  moves: {
    [move: string]: Function;
  };
}
