import * as dateMock from "jest-date-mock";
import {
  addToStore,
  getCredentials,
  storageKey,
  setCredentials,
} from "./credentials.service";

beforeEach(() => {
  localStorage.clear();
  dateMock.clear();
});

const timestamp = new Date(2020, 2, 19, 15, 17, 11);
const store = {
  "test-1": { credentials: "aaa", timestamp: timestamp.getTime() },
  "test-2": { credentials: "bbb", timestamp: timestamp.getTime() },
  "test-3": { credentials: "ccc", timestamp: timestamp.getTime() },
};

describe("addToStore", () => {
  const key = "test-key";
  const credentials = "test-credentials";

  test("new store contains given key/credentials", () => {
    const result = addToStore({}, key, credentials);
    expect(result).toHaveProperty(key);
    expect(result[key].credentials).toBe(credentials);
  });

  test("new store contains timestamp", () => {
    dateMock.advanceTo(timestamp);
    const result = addToStore({}, key, credentials);
    expect(result).toHaveProperty(key);
    expect(result[key].timestamp).toBe(timestamp.getTime());
  });

  test("new store contains all elements of old store", () => {
    const result = addToStore(store, key, credentials);

    Object.entries(store).forEach(([prop, value]) => {
      expect(result).toHaveProperty(prop);
      expect(result[prop]).toBe(value);
    });
  });
});

describe("getCredentials", () => {
  beforeEach(() => {
    localStorage.setItem(storageKey, JSON.stringify(store));
  });
  test("gets credentials for existing key", () => {
    const credentials = getCredentials("test", "1");
    expect(credentials).toBe("aaa");
  });

  test("returns undefined for non-existing key", () => {
    const credentials = getCredentials("test", "5");
    expect(credentials).toBeUndefined();
  });
});

describe("setCredentials", () => {
  test("store contains given credentials", () => {
    localStorage.setItem(storageKey, JSON.stringify(store));
    dateMock.advanceTo(timestamp);
    setCredentials("test", "4", "ddd");
    const expected = {
      ...store,
      "test-4": { credentials: "ddd", timestamp: timestamp.getTime() },
    };
    const rawStore = localStorage.getItem(storageKey);
    expect(rawStore).toBeDefined();
    const parsedStore = JSON.parse(rawStore!);
    expect(parsedStore).toEqual(expected);
  });

  test("store is initialized if not existing before", () => {
    dateMock.advanceTo(timestamp);
    setCredentials("test", "4", "ddd");
    const expected = {
      "test-4": { credentials: "ddd", timestamp: timestamp.getTime() },
    };
    const rawStore = localStorage.getItem(storageKey);
    expect(rawStore).toBeDefined();
    const parsedStore = JSON.parse(rawStore!);
    expect(parsedStore).toEqual(expected);
  });
});
