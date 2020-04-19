import differenceInDays from "date-fns/differenceInDays";
import flow from "lodash/fp/flow";

const storageKey = "wizard-credentials";

interface CredentialsStore {
  [key: string]: Credentials;
}

interface Credentials {
  credentials: string;
  timestamp: number;
}

function getKey(gameID: string, playerID: string): string {
  return `${gameID}-${playerID}`;
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

function addToStore(
  store: CredentialsStore,
  key: string,
  credentials: string
): CredentialsStore {
  return {
    ...store,
    [key]: {
      credentials,
      timestamp: new Date().getTime(),
    },
  };
}

export function setCredentials(
  gameID: string,
  playerID: string,
  credentials: string
): void {
  flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "{}",
    JSON.parse,
    cleanStore,
    (store) => addToStore(store, getKey(gameID, playerID), credentials),
    JSON.stringify,
    (value) => localStorage.setItem(storageKey, value)
  )();
}

export function getCredentials(
  gameID: string,
  playerID: string
): string | undefined {
  return flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "{}",
    JSON.parse,
    (store: CredentialsStore) => store[getKey(gameID, playerID)]?.credentials
  )();
}
