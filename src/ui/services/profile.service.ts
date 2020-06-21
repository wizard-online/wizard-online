import merge from "lodash/merge";
import flow from "lodash/fp/flow";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faRandom,
  faSortNumericUpAlt,
  faSortNumericDownAlt,
} from "@fortawesome/free-solid-svg-icons";

export const storageKey = "wizard-profile";

export interface ProfileStore {
  name: string;
  preferences: ProfilePreferences;
}

export interface ProfilePreferences {
  handOrder?: HandOrderPreference;
  turnAlert?: boolean;
}

export interface ProfileStoreWithId extends ProfileStore {
  id: string;
}

export interface MetaHandOrderPreference {
  handOrderPreference: HandOrderPreference;
  label: string;
  icon: IconDefinition;
}
export enum HandOrderPreference {
  None = "none",
  SortedAscending = "sortedAscending",
  SortedDescending = "sortedDescending",
}

export const MetaHandOrderPreferences = [
  {
    handOrderPreference: HandOrderPreference.None,
    label: "unsortiert",
    icon: faRandom,
  },
  {
    handOrderPreference: HandOrderPreference.SortedAscending,
    label: "aufsteigend sortiert",
    icon: faSortNumericUpAlt,
  },
  {
    handOrderPreference: HandOrderPreference.SortedDescending,
    label: "absteigend sortiert",
    icon: faSortNumericDownAlt,
  },
];

export function initializePreferences(): ProfilePreferences {
  return {
    handOrder: HandOrderPreference.None,
    turnAlert: false,
  };
}

export function getProfile(): ProfileStoreWithId | undefined {
  return flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "null",
    (value) => (JSON.parse(value) as ProfileStoreWithId) ?? undefined
  )();
}

export function setProfile(profile: ProfileStore): void {
  const id = `${profile.name}_${Date.now()}`;
  localStorage.setItem(storageKey, JSON.stringify({ ...profile, id }));
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
    ({ id, ...store }) => ({ ...merge(store, changes), id }),
    JSON.stringify,
    (value) => localStorage.setItem(storageKey, value)
  )();
}
