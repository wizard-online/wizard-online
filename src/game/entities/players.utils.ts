import range from "lodash/range";
import { GameMetadatum } from "boardgame.io";
import { PlayerID, NumPlayers, MaxCards, DECKSIZE } from "./players";

export function maxCards(numPlayers: NumPlayers): MaxCards {
  return (DECKSIZE / numPlayers) as MaxCards;
}

/**
 * Creates a list of the players who sit around the table starting with the specfied playerID.
 *
 * @export
 * @param {number} startWith
 * @param {NumPlayers} numPlayers
 * @returns {PlayerID[]}
 */
export function playersRound(
  startWith: number,
  numPlayers: NumPlayers
): PlayerID[] {
  return range(numPlayers).map(
    (e) => (e + startWith) % numPlayers
  ) as PlayerID[];
}

/**
 * Gets the name for a given playerID. If no name is found, the playerID is converted to a string.
 *
 * @export
 * @param {PlayerID} playerID
 * @param {State} { gameMetadata }
 * @returns {string}
 */
export function getPlayerName(
  playerID: PlayerID,
  gameMetadata: GameMetadatum[]
): string {
  const playerMetadata = gameMetadata.find(({ id }) => id === playerID);
  if (!playerMetadata || !playerMetadata.name) {
    return playerID.toString();
  }
  return playerMetadata.name;
}
