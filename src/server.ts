import * as Sentry from "@sentry/node";
import { Server } from "boardgame.io/server";
import { wizardGameConfig as Wizard } from "./game/game";

Sentry.init({ dsn: process.env.SENTRY_SERVER_DSN });

const server = Server({
  games: [Wizard],
});

// Start the server
// eslint-disable-next-line no-console
try {
  // eslint-disable-next-line no-console
  server.run(Number.parseInt(process.env.PORT || "8000", 10), () =>
    // eslint-disable-next-line no-console
    console.log("server running...")
  );
} catch (error) {
  // eslint-disable-next-line no-console
  console.log(error);
  throw error;
}
