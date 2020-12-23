import React from "react";
import {
  getProfile as getProfileStorage,
  setProfile as setProfileStorage,
  updateProfile as updateProfileStorage,
  ProfileStore,
  ProfileStoreWithId,
} from "./services/profile.service";

export interface ProfileProviderContext {
  profile: ProfileStoreWithId | undefined;
  setProfile(profile: ProfileStore): void;
  updateProfile(newProfile: Partial<ProfileStore>): void;
}

export const ProfileContext = React.createContext<
  ProfileProviderContext | undefined
>(undefined);

export const ProfileProvider: React.FC = ({ children }) => {
  const [profileState, setProfileState] = React.useState(getProfileStorage());
  const setProfile = React.useCallback((profile: ProfileStore) => {
    setProfileStorage(profile);
    setProfileState(getProfileStorage());
  }, []);
  const updateProfile = React.useCallback(
    (newProfile: Partial<ProfileStore>) => {
      updateProfileStorage(newProfile);
      setProfileState(getProfileStorage());
    },
    []
  );
  return (
    <ProfileContext.Provider
      value={{ profile: profileState, updateProfile, setProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfileContext(): ProfileProviderContext {
  const profileContext = React.useContext(ProfileContext);
  if (!profileContext)
    throw new Error(
      "useProfileContext hook is called outside the scope of ProfileProvider"
    );
  return profileContext;
}

export function useProfile(): ProfileStoreWithId {
  const { profile } = useProfileContext();
  if (!profile)
    throw new Error("useProfile hook is called without a set profile");
  return profile;
}
