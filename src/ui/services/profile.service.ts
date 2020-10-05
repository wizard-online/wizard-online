import merge from "lodash/merge";
import flow from "lodash/fp/flow";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faRandom,
  faSortNumericUpAlt,
  faSortNumericDownAlt,
} from "@fortawesome/free-solid-svg-icons";
import { WizardCharacter } from "../util/character-theme";

export const storageKey = "wizard-profile";

export interface ProfileStore {
  name: string;
  character: WizardCharacter;
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

export function getNextHandOrderPreference(
  current: HandOrderPreference
): MetaHandOrderPreference {
  const currentIndex = MetaHandOrderPreferences.findIndex(
    (element) => element.handOrderPreference === current
  );
  return MetaHandOrderPreferences[
    (currentIndex + 1) % MetaHandOrderPreferences.length
  ];
}

export const initialProfilePreferences: ProfilePreferences = {
  handOrder: HandOrderPreference.None,
  turnAlert: false,
};

export function getProfile(): ProfileStoreWithId | undefined {
  return flow(
    () => localStorage.getItem(storageKey),
    (value) => value ?? "null",
    (value) => JSON.parse(value) ?? undefined,
    (value) => {
      try {
        return {
          ...value,
          preferences: {
            ...initialProfilePreferences,
            ...(value.preferences ?? {}),
          },
        };
      } catch {
        return undefined;
      }
    }
  )();
}

export function setProfile(profile: ProfileStore): void {
  localStorage.setItem(
    storageKey,
    JSON.stringify({ id: `${profile.name}_${Date.now()}`, ...profile })
  );
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

export function isValidProfile(
  profile: unknown
): profile is ProfileStoreWithId {
  const isValid = !!(
    profile &&
    typeof profile === "object" &&
    (profile as ProfileStoreWithId).name &&
    typeof (profile as ProfileStoreWithId).name === "string" &&
    (profile as ProfileStoreWithId).id &&
    typeof (profile as ProfileStoreWithId).id === "string" &&
    (profile as ProfileStoreWithId).character &&
    typeof (profile as ProfileStoreWithId).character === "string" &&
    (profile as ProfileStoreWithId).preferences &&
    typeof (profile as ProfileStoreWithId).preferences === "object"
  );

  console.log("isValidProfile", isValid, profile);
  return isValid;
}
