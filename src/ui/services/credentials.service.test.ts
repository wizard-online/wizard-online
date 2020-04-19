import * as dateMock from "jest-date-mock";
import { addToStore } from "./credentials.service";

beforeEach(() => {
  localStorage.clear();
  dateMock.clear();
});

describe("addToStore", () => {
  const key = "test-key";
  const credentials = "test-credentials";
  const timestamp = new Date(2020, 2, 19, 15, 17, 11);

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
    const oldStore = {
      "test-1": { credentials: "aaa", timestamp: timestamp.getTime() },
      "test-2": { credentials: "bbb", timestamp: timestamp.getTime() },
      "test-3": { credentials: "ccc", timestamp: timestamp.getTime() },
    };
    const result = addToStore(oldStore, key, credentials);

    Object.entries(oldStore).forEach(([prop, value]) => {
      expect(result).toHaveProperty(prop);
      expect(result[prop]).toBe(value);
    });
  });
});
