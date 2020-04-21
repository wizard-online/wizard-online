import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";

import { wizardGameConfig } from "./game/game";
import { WizardBoard } from "./ui/WizardBoard";

export const WizardClient = Client({
  game: wizardGameConfig,
  board: WizardBoard,
  multiplayer: SocketIO({ server: "http://localhost:8000" }),
});
