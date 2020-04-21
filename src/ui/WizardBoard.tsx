import React from "react";
import { State } from "boardgame.io";
import { GameContext } from "./GameContext";
import { PlayerID } from "../game/entities/players";
import { WizardState } from "../game/WizardState";
import { GameState } from "./GameState";
import { NotificationsProvider } from "./NotificationsProvider";
import { GameEvents } from "./GameEvents";
import { WizardLayout } from "./WizardLayout";

export const WizardBoard: React.FC<State> = ({ G, playerID, ...rest }) => {
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
      <NotificationsProvider>
        <GameEvents>
          <WizardLayout />
        </GameEvents>
      </NotificationsProvider>
    </GameContext.Provider>
  );
};
