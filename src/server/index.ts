/* eslint-disable no-console */
import * as Sentry from "@sentry/node";
import { Server } from "boardgame.io/server";
import { PostgresStore } from "bgio-postgres";
import { StorageCache } from "bgio-storage-cache";
import { loadGameConfig } from "../shared/load-game-config";
import { ServerPostgres } from "./server-postgres";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

Sentry.init({ dsn: process.env.SENTRY_SERVER_DSN });

let db: StorageCache | undefined;
if (process.env.DATABASE_URL) {
  const postgres = new PostgresStore(process.env.DATABASE_URL!, {
    dialectOptions:
      process.env.DB_DISABLE_SSL === "true"
        ? {}
        : // fix SSL error https://stackoverflow.com/a/64960461
          {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
  });
  const serverPostgres = new ServerPostgres(postgres);
  db = new StorageCache(serverPostgres);
  console.log("using postgresql storage");
} else {
  console.log("using in-memory storage");
}

const server = Server({
  games: [loadGameConfig()],
  db,
});

// Health check endpoint for Coolify
server.app.use(async (ctx, next) => {
  if (ctx.path === "/health" && ctx.method === "GET") {
    ctx.status = 200;
    ctx.body = "ok";
    return;
  }
  await next();
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
