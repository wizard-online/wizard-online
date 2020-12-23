import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";

import { WizardBoard } from "./ui/WizardBoard";
import { loadGameConfig } from "../shared/load-game-config";

export const WizardClient = Client({
  game: loadGameConfig(),
  board: WizardBoard,
  multiplayer: SocketIO({ server: process.env.API_URL }),
  debug:
    process.env.NODE_ENV === "development" &&
    process.env.BOARDGAME_DEBUG === "true",
});
