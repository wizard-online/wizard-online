import { State } from "boardgame.io";
import { WizardState } from "../boardgame/WizardState";
import { PlayerID } from "../boardgame/entities/players";

export interface GameState extends State {
  wizardState: WizardState;
  clientID: PlayerID;
}
