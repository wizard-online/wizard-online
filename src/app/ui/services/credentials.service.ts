import differenceInDays from "date-fns/differenceInDays";
import flow from "lodash/fp/flow";
import { PlayerID } from "../../../shared/entities/players";

export const storageKey = "wizard-credentials";

export interface CredentialsStore {
  [gameID: string]: Credentials;
}

export interface Credentials {
  playerID: PlayerID;
  credentials: string;
  timestamp: number;
}

function cleanStore(store: CredentialsStore): CredentialsStore {
  const now = Date.now();

  return Object.entries(store).reduce((acc, [key, entry]) => {
    if (differenceInDays(now, entry.timestamp) < 1) {
      acc[key] = entry;
    }
    return acc;
  }, {} as CredentialsStore);
}

export function addToStore(
  store: CredentialsStore,
  gameID: string,
  playerID: PlayerID,
  credentials: string
): CredentialsStore {
  return {
    ...store,
    [gameID]: {
      playerID,
      credentials,
      timestamp: new Date().getTime(),
    },
  };
}

export function removeFromStore(
  store: CredentialsStore,
  gameID: string
): CredentialsStore {
  const { [gameID]: removedCredential, ...rest } = store;
  return rest;
}

export function setCredentials(
  gameID: string,
  playerID: PlayerID,
  credentials: string
): void {
  flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "{}",
    JSON.parse,
    cleanStore,
    (store) => addToStore(store, gameID, playerID, credentials),
    JSON.stringify,
    (value) => localStorage.setItem(storageKey, value)
  )();
}

export function unsetCredentials(gameID: string): void {
  flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "{}",
    JSON.parse,
    cleanStore,
    (store) => removeFromStore(store, gameID),
    JSON.stringify,
    (value) => localStorage.setItem(storageKey, value)
  )();
}

export function getCredentials(gameID: string): Credentials | undefined {
  return flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "{}",
    JSON.parse,
    (store: CredentialsStore) => store[gameID]
  )();
}
