import { State } from "boardgame.io";
import { WizardState } from "../game/WizardState";
import { PlayerID } from "../game/entities/players";

export interface GameState extends State {
  wizardState: WizardState;
  clientID: PlayerID;
}
