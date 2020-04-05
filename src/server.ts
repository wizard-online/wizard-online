import * as Sentry from "@sentry/node";
import { Server } from "boardgame.io/server";
import { wizardGameConfig as Wizard } from "./game/game";

Sentry.init({ dsn: process.env.SENTRY_SERVER_DSN });

const server = Server({
  games: [Wizard],
});

// eslint-disable-next-line no-console
server.run(8000, () => console.log("server running..."));
