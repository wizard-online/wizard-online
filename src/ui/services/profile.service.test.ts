import * as dateMock from "jest-date-mock";
import { WizardCharacter } from "../util/character-theme";
import {
  HandOrderPreference,
  storageKey,
  getProfile,
  setProfile,
  updateProfile,
  ProfileStore,
} from "./profile.service";

beforeEach(() => {
  localStorage.clear();
  dateMock.clear();
});

const name = "test-name";
const newName = "test-name-new";
const handOrder = HandOrderPreference.None;
const newHandOrder = HandOrderPreference.SortedAscending;

const profile: ProfileStore = {
  name,
  character: WizardCharacter.Human,
  preferences: { handOrder },
};

describe("getProfile", () => {
  test("gets the profile if existing", () => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
    expect(getProfile()).toEqual(profile);
  });

  test("returns undefined if profile not existing", () => {
    expect(getProfile()).toBeUndefined();
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
        preferences: { handOrder },
      },
    },
    {
      update: { preferences: { handOrder: newHandOrder } },
      expected: {
        name,
        preferences: { handOrder: newHandOrder },
      },
    },
    {
      update: { name: newName, preferences: { handOrder: newHandOrder } },
      expected: {
        name: newName,
        preferences: { handOrder: newHandOrder },
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
