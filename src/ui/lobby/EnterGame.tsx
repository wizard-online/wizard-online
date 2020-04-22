import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import { GameRoom } from "../services/api.service";

interface EnterGameProps {
  gameID: string;
  game?: GameRoom;
  joined?: boolean;
  fetchGame(): void;
  onEnterGame(): void;
  canEnterGame: boolean;
  onLeaveGame(): void;
}

export const EnterGame: React.FC<EnterGameProps> = ({
  gameID,
  game,
  joined,
  fetchGame,
  onEnterGame,
  canEnterGame,
  onLeaveGame,
}) => {
  useEffect(() => {
    const intervalID = setInterval(fetchGame, 1000);
    return () => clearInterval(intervalID);
  }, [fetchGame]);

  // show loading screen until game is available
  if (!game) {
    return <div>Lade das Spiel...</div>;
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
        {joined ? (
          <Button onClick={onLeaveGame}>Spiel verlassen</Button>
        ) : (
          <Button
            onClick={onEnterGame}
            disabled={!canEnterGame}
            color="primary"
            variant="contained"
          >
            Spiel beitreten
          </Button>
        )}
      </div>
    </div>
  );
};
