import React, { useState, useCallback, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import random from "lodash/random";
import { EnterMatch } from "./EnterMatch";
import { PlayMatch } from "./PlayMatch";
import {
  getCredentials,
  Credentials,
  setCredentials,
  unsetCredentials,
} from "../services/credentials.service";
import {
  Match,
  getMatch,
  joinMatch,
  leaveMatch,
} from "../services/api.service";
import { useProfile } from "../ProfileProvider";
import { joinedGameEventGA, leftGameEventGA } from "../../analytics";

export const MatchContainer: React.FC = () => {
  const history = useHistory();
  const { name } = useProfile();
  const { matchID } = useParams<{ matchID: string }>();
  const [matchState, setMatchState] = useState<Match | undefined>();
  const [credentialsState, setCredentialsState] = useState<
    Credentials | undefined
  >();

  const fetchMatch = useCallback(async () => {
    try {
      const matchResponse = await getMatch(matchID!);
      setMatchState(matchResponse);
      setCredentialsState(getCredentials(matchID));
    } catch {
      history.replace("/");
    }
  }, [matchID, history]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  if (!matchState) {
    return <div>Spiel wird geladen...</div>;
  }

  const freeSeats = matchState.players.filter((player) => !player.name);
  const playing = !freeSeats.length;

  if (playing) {
    const credentialsStore = getCredentials(matchID);
    if (credentialsStore) {
      const { playerID, credentials } = credentialsStore;
      return (
        <PlayMatch
          matchID={matchID}
          playerID={playerID}
          credentials={credentials}
        />
      );
    }
    // spectate match
    return <PlayMatch matchID={matchID} />;
  }

  return (
    <EnterMatch
      match={matchState}
      fetchMatch={fetchMatch}
      onEnterMatch={async () => {
        if (!credentialsState) {
          const seatIndex = random(freeSeats.length - 1);
          const { id } = freeSeats[seatIndex];
          const newCredentials = await joinMatch(matchID, id, name);
          setCredentials(matchID, id, newCredentials);
          fetchMatch();
          joinedGameEventGA();
        }
      }}
      canEnterMatch={freeSeats.length > 0}
      onLeaveMatch={async () => {
        if (credentialsState) {
          await leaveMatch(
            matchID,
            credentialsState.playerID,
            credentialsState.credentials
          );
          unsetCredentials(matchID);
          fetchMatch();
          leftGameEventGA();
        }
      }}
      joined={!!credentialsState}
    />
  );
};
