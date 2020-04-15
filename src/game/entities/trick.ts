import { PlayerID } from "./players";
import { Card } from "./cards";

export interface OptionalTrickCard {
  card: Card | undefined;
  player: PlayerID;
}
export interface TrickCard extends OptionalTrickCard {
  card: Card;
}
