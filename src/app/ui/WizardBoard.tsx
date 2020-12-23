import React from "react";
import type { BoardProps } from "boardgame.io/react";
import { GameContext } from "./GameContext";
import { PlayerID } from "../../shared/entities/players";
import { WizardState } from "../../shared/WizardState";
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
          clientID: playerID !== null ? PlayerID(playerID) : null,
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
