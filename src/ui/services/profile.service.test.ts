import * as dateMock from "jest-date-mock";
import {
  HandOrderPreference,
  storageKey,
  getProfile,
  setProfile,
  updateProfile,
  ProfileStoreWithoutId,
} from "./profile.service";

beforeEach(() => {
  localStorage.clear();
  dateMock.clear();
});

const name = "test-name";
const newName = "test-name-new";
const handOrderPreference = HandOrderPreference.None;
const newHandOrderPreference = HandOrderPreference.Sorted;

const profile: ProfileStoreWithoutId = {
  name,
  handOrderPreference,
};

describe("getProfile", () => {
  test("gets the profile if existing", () => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
    expect(getProfile()).toEqual(profile);
  });

  test("returns null if profile not existing", () => {
    expect(getProfile()).toBeNull();
  });
});

describe("setProfile", () => {
  test("new profile is stored", () => {
    setProfile(profile);
    const { id, ...storedProfile } = JSON.parse(
      localStorage.getItem(storageKey) ?? ""
    );
    expect(storedProfile).toEqual(profile);
  });

  test("creates id", () => {
    const timestamp = new Date(2020, 2, 17, 17, 17, 17);
    dateMock.advanceTo(timestamp);

    setProfile(profile);
    const { id } = JSON.parse(localStorage.getItem(storageKey) ?? "");
    expect(id).toBe(`${profile.name}_${timestamp.getTime()}`);
  });
});

describe("updateProfile", () => {
  test("throws error if no existing profile is stored yet", () => {
    expect(() => updateProfile({ name: newName })).toThrow();
  });

  test("keeps id", () => {
    const timestamp = new Date(2020, 2, 17, 17, 17, 17);
    dateMock.advanceTo(timestamp);

    setProfile(profile);
    updateProfile({ name: newName });
    const { id } = JSON.parse(localStorage.getItem(storageKey) ?? "");
    expect(id).toBe(`${profile.name}_${timestamp.getTime()}`);
  });

  test.each([
    {
      update: { name: newName },
      expected: {
        name: newName,
        handOrderPreference,
      },
    },
    {
      update: { handOrderPreference: newHandOrderPreference },
      expected: {
        name,
        handOrderPreference: newHandOrderPreference,
      },
    },
    {
      update: { name: newName, handOrderPreference: newHandOrderPreference },
      expected: {
        name: newName,
        handOrderPreference: newHandOrderPreference,
      },
    },
  ])("updates all given fields and", ({ update, expected }) => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
    updateProfile(update);
    expect(JSON.parse(localStorage.getItem(storageKey) ?? "")).toEqual(
      expected
    );
  });
});
