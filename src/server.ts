import { Server } from "boardgame.io/server";
import { wizardGameConfig as Wizard } from "./game/game";

const server = Server({
  games: [Wizard],
});

// eslint-disable-next-line no-console
server.run(8000, () => console.log("server running..."));
