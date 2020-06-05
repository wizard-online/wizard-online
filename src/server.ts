/* eslint-disable no-console */
import * as Sentry from "@sentry/node";
import { Server } from "boardgame.io/server";
import { PostgresStore } from "bgio-postgres";
import { loadGameConfig } from "./game/load-game-config";

require("dotenv").config();

Sentry.init({ dsn: process.env.SENTRY_SERVER_DSN });

let db: PostgresStore | undefined;
if (
  process.env.DB_HOST &&
  process.env.DB_NAME &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD
) {
  console.log("using postgresql storage");

  db = new PostgresStore({
    database: process.env.DB_HOST,
    username: "postgres",
    password: "dthosen",
    host: process.env.DB_HOST,
  });
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
