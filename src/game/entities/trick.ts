import { PlayerID } from "./players";
import { Card } from "./cards";

export type OptionalTrickCard = [Card | undefined, PlayerID];
export type TrickCard = [Card, PlayerID];
