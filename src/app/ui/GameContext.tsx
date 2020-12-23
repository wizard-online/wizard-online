import React, { useContext } from "react";
import { PlayerMetadata } from "boardgame.io";
import { GameState } from "./GameState";
import { getPlayerName } from "../../shared/entities/players.utils";
import { PlayerID } from "../../shared/entities/players";
import { WizardCharacter } from "./util/character-theme";

export interface AppState {
  gamestate?: GameState;
}

export const GameContext = React.createContext<AppState>({});

export const useGameState = (): GameState => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) throw new Error("GameState is not defined");
  return gamestate;
};

/**
 * React Hook to get a player's name by its ID.
 *
 * @export
 * @param {PlayerID} playerID
 * @returns {string} the player name
 */
export function usePlayerName(playerID: PlayerID): string {
  const { matchData } = useGameState();
  return getPlayerName(playerID, matchData ?? []);
}

export function usePlayerCharacter(
  playerID: PlayerID
): WizardCharacter | undefined {
  const { matchData } = useGameState();
  const playerMetadata: PlayerMetadata | undefined = (matchData ?? []).find(
    ({ id }) => id === playerID
  );
  return playerMetadata?.data?.character;
}
