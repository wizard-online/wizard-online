import { State } from "boardgame.io";
import { WizardState } from "../boardgame/G";

export interface GameState extends State {
  G: WizardState;
  moves: {
    [move: string]: Function;
  };
}
