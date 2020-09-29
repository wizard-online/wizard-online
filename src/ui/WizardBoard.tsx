import React from "react";
import type { BoardProps } from "boardgame.io/react";
import { GameContext } from "./GameContext";
import { PlayerID } from "../game/entities/players";
import { WizardState } from "../game/WizardState";
import { GameState } from "./GameState";
import { GameEvents } from "./GameEvents";
import { WizardLayout } from "./WizardLayout";
import { SelectedCardProvider } from "./SelectedCardContext";

export const WizardBoard: React.FC<BoardProps<WizardState>> = ({
  G,
  playerID,
  ...rest
}) => {
  return (
    <GameContext.Provider
      value={{
        gamestate: {
          wizardState: G as WizardState,
          clientID: PlayerID(playerID),
          ...rest,
        } as GameState,
      }}
    >
      <GameEvents>
        <SelectedCardProvider>
          <WizardLayout />
        </SelectedCardProvider>
      </GameEvents>
    </GameContext.Provider>
  );
};
