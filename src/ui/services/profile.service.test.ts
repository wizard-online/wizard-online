import {
  ProfileStore,
  HandOrderPreference,
  storageKey,
  getProfile,
  setProfile,
  updateProfile,
} from "./profile.service";

beforeEach(() => {
  localStorage.clear();
});

const name = "test-name";
const newName = "test-name-new";
const handOrderPreference = HandOrderPreference.None;
const newHandOrderPreference = HandOrderPreference.Sorted;

const profile: ProfileStore = {
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
    expect(JSON.parse(localStorage.getItem(storageKey) ?? "")).toEqual(profile);
  });
});

describe("updateProfile", () => {
  test("throws error if no existing profile is stored yet", () => {
    expect(() => updateProfile({ name: newName })).toThrow();
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
