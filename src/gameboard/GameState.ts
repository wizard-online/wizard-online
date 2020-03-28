import { State } from "boardgame.io";
import { WizardState } from "../boardgame/WizardState";

export interface GameState extends State {
  G: WizardState;
  moves: {
    [move: string]: Function;
  };
}
