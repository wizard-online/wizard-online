/**
 * Re-exports boardgame.io types that aren't exposed at the top level.
 *
 * In boardgame.io 0.50, EventsAPI and RandomAPI are used by DefaultPluginAPIs
 * but not directly exported from "boardgame.io". We extract them here so game
 * functions can reference them without reaching into internal paths.
 */
import { DefaultPluginAPIs } from "boardgame.io";

export type EventsAPI = DefaultPluginAPIs["events"];
export type RandomAPI = DefaultPluginAPIs["random"];
