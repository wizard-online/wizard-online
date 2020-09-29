import type { BoardProps } from "boardgame.io/react";
import { WizardState } from "../game/WizardState";
import { PlayerID } from "../game/entities/players";

export interface GameState extends Omit<BoardProps, "G" | "playerID"> {
  wizardState: WizardState;
  clientID: PlayerID;
}
