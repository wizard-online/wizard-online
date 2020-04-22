import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import { getAllGames, GameRoom } from "../services/api.service";
import { sortGameSeats } from "../util/game-seats";
import { colors } from "../util/colors";

export const ListGames: React.FC = () => {
  const [games, setGames] = useState<GameRoom[]>([]);
  const fetchGames = useCallback(async () => {
    const allGames = await getAllGames();
    setGames(allGames);
  }, []);
  useEffect(() => {
    fetchGames();
    const intervalID = setInterval(fetchGames, 2000);
    return () => clearInterval(intervalID);
  }, [fetchGames]);
  return (
    <>
      <h2>Alle Spiele</h2>
      <GameList>
        {games.map(({ gameID, players }) => {
          const sortedSeats = sortGameSeats(players);
          const filledSeats = players.filter(({ name }) => !!name);
          return (
            <li key={gameID}>
              <GameSeats>
                <Link component={RouterLink} to={`/games/${gameID}`}>
                  {sortedSeats.map(({ name }) => name ?? "_").join(", ")}{" "}
                </Link>
              </GameSeats>
              <SeatInfo>
                {filledSeats.length} von {players.length} Plätzen besetzt
              </SeatInfo>
            </li>
          );
        })}
      </GameList>
      <Link component={RouterLink} to="/">
        Neues Spiel erstellen
      </Link>
    </>
  );
};

const GameList = styled.ul`
  list-style-type: none;
`;

const GameSeats = styled.h4`
  margin-bottom: 0;
`;

const SeatInfo = styled.small`
  display: block;
  color: ${colors.grey};
`;
