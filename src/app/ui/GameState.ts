import type { BoardProps } from "boardgame.io/react";
import { WizardState } from "../../shared/WizardState";
import { PlayerID } from "../../shared/entities/players";

export interface GameState extends Omit<BoardProps, "G" | "playerID"> {
  wizardState: WizardState;
  clientID: PlayerID;
}
