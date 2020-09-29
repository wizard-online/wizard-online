import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import { getAllMatches, Match } from "../services/api.service";
import { sortMatchSeats } from "../util/match-seats";
import { colors } from "../util/colors";

export const ListMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const fetchMatches = useCallback(async () => {
    const allMatches = await getAllMatches();
    setMatches(allMatches);
  }, []);
  useEffect(() => {
    fetchMatches();
    const intervalID = setInterval(fetchMatches, 2000);
    return () => clearInterval(intervalID);
  }, [fetchMatches]);
  return (
    <>
      <h2>Alle Spiele</h2>
      <MatchList>
        {matches.map(({ matchID, players }) => {
          const sortedSeats = sortMatchSeats(players);
          const filledSeats = players.filter(({ name }) => !!name);
          return (
            <li key={matchID}>
              <MatchSeats>
                <Link component={RouterLink} to={`/matches/${matchID}`}>
                  {sortedSeats.map(({ name }) => name ?? "_").join(", ")}{" "}
                </Link>
              </MatchSeats>
              <SeatInfo>
                {filledSeats.length} von {players.length} Plätzen besetzt
              </SeatInfo>
            </li>
          );
        })}
      </MatchList>
    </>
  );
};

const MatchList = styled.ul`
  list-style-type: none;
`;

const MatchSeats = styled.h4`
  margin-bottom: 0;
`;

const SeatInfo = styled.small`
  display: block;
  color: ${colors.grey};
`;
