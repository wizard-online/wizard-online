/* eslint-disable no-console */
import * as Sentry from "@sentry/node";
import { Server } from "boardgame.io/server";
import { PostgresStore } from "bgio-postgres";
import { loadGameConfig } from "./game/load-game-config";

require("dotenv").config();

Sentry.init({ dsn: process.env.SENTRY_SERVER_DSN });

let db: PostgresStore | undefined;
if (process.env.DATABASE_URL) {
  db = new PostgresStore(process.env.DATABASE_URL!);
  console.log("using postgresql storage");
} else {
  console.log("using in-memory storage");
}

const server = Server({
  games: [loadGameConfig()],
  db,
});

// Start the server
try {
  server.run(Number.parseInt(process.env.PORT || "8000", 10), () =>
    console.log("server running...")
  );
} catch (error) {
  console.log(error);
  throw error;
}
