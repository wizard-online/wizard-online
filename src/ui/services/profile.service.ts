import flow from "lodash/fp/flow";

export const storageKey = "wizard-profile";

export interface ProfileStore {
  name: string;
  handOrderPreference: HandOrderPreference;
}

export enum HandOrderPreference {
  None = "none",
  Sorted = "sorted",
}

export function getProfile(): ProfileStore | null {
  return flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "null",
    (value) => JSON.parse(value) as ProfileStore
  )();
}

export function setProfile(profile: ProfileStore): void {
  localStorage.setItem(storageKey, JSON.stringify(profile));
}

export function updateProfile(changes: Partial<ProfileStore>): void {
  flow(
    () => localStorage.getItem(storageKey),
    (value) => {
      if (!value) {
        throw new Error("cannot update profile if it is undefined");
      }
      return value;
    },
    JSON.parse,
    (store) => ({ ...store, ...changes }),
    JSON.stringify,
    (value) => localStorage.setItem(storageKey, value)
  )();
}
