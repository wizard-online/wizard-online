/* eslint-disable no-console */
import * as Sentry from "@sentry/node";
import { Server } from "boardgame.io/server";
import { PostgresStore } from "bgio-postgres";
import { StorageCache } from "bgio-storage-cache";
import { loadGameConfig } from "./game/load-game-config";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

Sentry.init({ dsn: process.env.SENTRY_SERVER_DSN });

let db: StorageCache | undefined;
if (process.env.DATABASE_URL) {
  const postgres = new PostgresStore(process.env.DATABASE_URL!, {
    // fix SSL error https://stackoverflow.com/a/64960461
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  db = new StorageCache(postgres);
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
