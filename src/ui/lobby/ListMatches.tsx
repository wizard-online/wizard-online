import React from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Link, Icon, IconButton } from "@material-ui/core";
import { subHours } from "date-fns";
import { getAllMatches, Match } from "../services/api.service";
import { sortMatchSeats } from "../util/match-seats";
import { colors } from "../util/colors";

export const ListMatches: React.FC = () => {
  const [matches, setMatches] = React.useState<Match[]>([]);

  const fetchMatches = React.useCallback(async () => {
    const updatedAfter = subHours(new Date(), 24);
    const allMatches = await getAllMatches({ updatedAfter });
    setMatches(allMatches);
  }, []);

  React.useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <>
      <h2>Aktuelle Spiele</h2>
      <IconButton onClick={fetchMatches} aria-label="Liste aktualisieren">
        <Icon>refresh</Icon>
      </IconButton>
      {matches.length > 0 ? (
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
      ) : (
        <div>
          Aktuell laufen keine Spiele.
          <br />
          <RouterLink to="/">Starte ein neues Spiel.</RouterLink>
        </div>
      )}
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
