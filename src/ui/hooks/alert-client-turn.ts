import audioAlertFile from "../../assets/kalimba.mp3";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";

const audioAlert = new Audio(audioAlertFile);

const handleClientTurn = (): void => {
  audioAlert.play();
};

export function useAlertClientTurn(): void {
  useGameEventHandler(GameEvent.ClientTurn, handleClientTurn);
}
