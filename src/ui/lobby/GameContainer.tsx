import React, { useState, useCallback, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import random from "lodash/random";
import { EnterGame } from "./EnterGame";
import { PlayGame } from "./PlayGame";
import {
  getCredentials,
  Credentials,
  setCredentials,
  unsetCredentials,
} from "../services/credentials.service";
import {
  GameRoom,
  getGame,
  joinGame,
  leaveGame,
} from "../services/api.service";
import { useProfile } from "../ProfileProvider";

export const GameContainer: React.FC = () => {
  const history = useHistory();
  const { name } = useProfile();
  const { gameID } = useParams<{ gameID: string }>();
  const [gameState, setGameState] = useState<GameRoom | undefined>();
  const [credentialsState, setCredentialsState] = useState<
    Credentials | undefined
  >();

  const fetchGame = useCallback(async () => {
    try {
      const gameResponse = await getGame(gameID!);
      setGameState(gameResponse);
      setCredentialsState(getCredentials(gameID));
    } catch (error) {
      history.replace("/");
    }
  }, [gameID, history]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  if (!gameState) {
    return <div>Spiel wird geladen...</div>;
  }

  const freeSeats = gameState.players.filter((player) => !player.name);
  const playing = !freeSeats.length;

  if (playing) {
    const credentialsStore = getCredentials(gameID);
    if (credentialsStore) {
      const { playerID, credentials } = credentialsStore;
      return (
        <PlayGame
          gameID={gameID}
          playerID={playerID}
          credentials={credentials}
        />
      );
    }
    return <div>Spiel zuschauen</div>;
  }

  return (
    <EnterGame
      gameID={gameID}
      fetchGame={fetchGame}
      onEnterGame={async () => {
        const seatIndex = random(freeSeats.length - 1);
        const { id } = freeSeats[seatIndex];
        const newCredentials = await joinGame(gameID, id, name);
        setCredentials(gameID, id, newCredentials);
        fetchGame();
      }}
      canEnterGame={freeSeats.length > 0}
      onLeaveGame={async () => {
        if (credentialsState) {
          await leaveGame(
            gameID,
            credentialsState.playerID,
            credentialsState.credentials
          );
          unsetCredentials(gameID);
          fetchGame();
        }
      }}
    />
  );
};
