import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import range from "lodash/range";
import { GameRoom } from "../services/api.service";

interface EnterGameProps {
  game?: GameRoom;
  joined?: boolean;
  fetchGame(): void;
  onEnterGame(): void;
  canEnterGame: boolean;
  onLeaveGame(): void;
}

export const EnterGame: React.FC<EnterGameProps> = ({
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

  const filledSeats = game.players.filter(({ name }) => !!name);

  return (
    <div>
      <h3>
        {filledSeats.length} von {game.players.length} Plätzen belegt
      </h3>

      <SeatList>
        {filledSeats
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ id, name }) => (
            <Seat key={id}>{name}</Seat>
          ))}
        {range(game.players.length - filledSeats.length).map((i) => (
          <Seat key={`empty-${i}`}>_</Seat>
        ))}
      </SeatList>
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

const SeatList = styled.ul`
  list-style-type: none;
`;

const Seat = styled.li``;
