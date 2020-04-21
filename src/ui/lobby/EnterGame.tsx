import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@material-ui/core";
import random from "lodash/random";
import { useHistory } from "react-router-dom";
import {
  getGame,
  GameRoom,
  joinGame,
  leaveGame,
} from "../services/api.service";
import { useProfile } from "../ProfileProvider";
import {
  setCredentials,
  getCredentials,
  Credentials,
  unsetCredentials,
} from "../services/credentials.service";

interface EnterGameProps {
  gameID: string;
  startGame(): void;
}

export const EnterGame: React.FC<EnterGameProps> = ({ gameID, startGame }) => {
  const history = useHistory();
  const { name: playerName } = useProfile();
  const [game, setGame] = useState<GameRoom | undefined>();
  const [credentialsState, setCredentialsState] = useState<
    Credentials | undefined
  >();

  const fetchGame = useCallback(async () => {
    try {
      const gameResponse = await getGame(gameID!);
      setGame(gameResponse);
      setCredentialsState(getCredentials(gameID));
    } catch (error) {
      history.replace("/");
    }
  }, [gameID, history]);

  useEffect(() => {
    fetchGame();
    const intervalID = setInterval(fetchGame, 1000);
    return () => clearInterval(intervalID);
  }, [fetchGame]);

  // show loading screen until game is available
  if (!game) {
    return <div>Lade das Spiel...</div>;
  }

  const freeSeats = game.players.filter((player) => !player.name);

  if (credentialsState && freeSeats.length === 0) {
    startGame();
  }

  return (
    <div>
      <div>{gameID}</div>
      <div>{JSON.stringify(game)}</div>
      <ul>
        {game.players.map(({ id, name }) => (
          <li key={id}>
            {id}: {name}
          </li>
        ))}
      </ul>
      <div>
        {!credentialsState && (
          <Button
            onClick={async () => {
              const { id } = freeSeats[random(freeSeats.length)];
              const newCredentials = await joinGame(gameID, id, playerName);
              setCredentials(gameID, id, newCredentials);
              fetchGame();
            }}
            disabled={!freeSeats.length}
          >
            Spiel beitreten
          </Button>
        )}
        {credentialsState && freeSeats.length > 0 && (
          <Button
            onClick={async () => {
              await leaveGame(
                gameID,
                credentialsState.playerID,
                credentialsState.credentials
              );
              unsetCredentials(gameID);
              fetchGame();
            }}
            disabled={!freeSeats.length}
          >
            Spiel verlassen
          </Button>
        )}
        {credentialsState && freeSeats.length === 0 && <div>Playing!</div>}
      </div>
    </div>
  );
};
