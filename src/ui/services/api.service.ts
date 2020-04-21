import { wizardGameConfig } from "../../game/game";
import { PlayerID } from "../../game/entities/players";
import { post, get } from "./fetch.service";

const { name, minPlayers, maxPlayers } = wizardGameConfig;

type GameID = string;
type PlayerCredentials = string;
export interface GameRoom {
  roomID: GameID;
  players: { id: PlayerID; name: string }[];
  setupData?: unknown;
}

export function createGame(
  numPlayers: number,
  setupData?: unknown
): Promise<GameID> {
  if (numPlayers < minPlayers || numPlayers > maxPlayers) {
    throw new Error(`invalid number of players ${numPlayers}`);
  }
  const body = {
    numPlayers: numPlayers.toString(),
    setupData,
  };
  return post(`/games/${name}/create`, body)
    .then((response) => response.json())
    .then((json) => json.gameID as GameID);
}

export function joinGame(
  gameID: GameID,
  playerID: PlayerID,
  playerName: string
): Promise<PlayerCredentials> {
  return post(`/games/${name}/${gameID}/join`, {
    playerID: playerID.toString(),
    playerName,
  })
    .then((response) => response.json())
    .then((json) => json.playerCredentials as PlayerCredentials);
}

export function leaveGame(
  gameID: GameID,
  playerID: PlayerID,
  credentials: PlayerCredentials
): Promise<Response> {
  return post(`/games/${name}/${gameID}/leave`, {
    playerID: playerID.toString(),
    credentials,
  });
}

export function getGame(gameID: GameID): Promise<GameRoom> {
  return get(`/games/${name}/${gameID}`).then(
    (response) => response.json() as Promise<GameRoom>
  );
}
