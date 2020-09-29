import type { LobbyAPI } from "boardgame.io";
import { wizardGameConfig } from "../../game/game";
import { PlayerID } from "../../game/entities/players";
import { post, get } from "./fetch.service";
import { WizardSetupData } from "../../game/WizardState";

const { name, minPlayers, maxPlayers } = wizardGameConfig;

type MatchID = string;
type PlayerCredentials = string;
// export interface Match {
//   matchID?: MatchID;
//   gameID?: MatchID;
//   players: MatchSeat[];
//   setupData?: WizardSetupData;
// }
export interface Match extends LobbyAPI.Match {
  players: MatchSeat[];
}

export interface MatchSeat {
  id: PlayerID;
  name?: string;
}

export function createMatch(
  numPlayers: number,
  setupData?: WizardSetupData
): Promise<MatchID> {
  if (numPlayers < minPlayers || numPlayers > maxPlayers) {
    throw new Error(`invalid number of players ${numPlayers}`);
  }
  const body = {
    numPlayers: numPlayers.toString(),
    setupData,
  };
  return post(`/games/${name}/create`, body)
    .then<LobbyAPI.CreatedMatch>((response) => response.json())
    .then((json) => json.matchID);
}

export function joinMatch(
  matchID: MatchID,
  playerID: PlayerID,
  playerName: string
): Promise<PlayerCredentials> {
  return post(`/games/${name}/${matchID}/join`, {
    playerID: playerID.toString(),
    playerName,
  })
    .then<LobbyAPI.JoinedMatch>((response) => response.json())
    .then((json) => json.playerCredentials);
}

export function leaveMatch(
  matchID: MatchID,
  playerID: PlayerID,
  credentials: PlayerCredentials
): Promise<Response> {
  return post(`/games/${name}/${matchID}/leave`, {
    playerID: playerID.toString(),
    credentials,
  });
}

export function getMatch(matchID: MatchID): Promise<Match> {
  return get(`/games/${name}/${matchID}`).then<Match>((response) =>
    response.json()
  );
}

export function getAllMatches(): Promise<Match[]> {
  return get(`/games/${name}`)
    .then((response) => response.json())
    .then<Match[]>(({ matches }) => matches);
}
