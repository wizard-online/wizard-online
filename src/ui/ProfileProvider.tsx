import React, { useState, useCallback, useContext } from "react";
import {
  getProfile as getProfileStorage,
  setProfile as setProfileStorage,
  updateProfile as updateProfileStorage,
  ProfileStore,
} from "./services/profile.service";

export interface ProfileProviderContext {
  profile: ProfileStore | null;
  setProfile(profile: ProfileStore): void;
  updateProfile(newProfile: Partial<ProfileStore>): void;
}

export const ProfileContext = React.createContext<
  ProfileProviderContext | undefined
>(undefined);

export const ProfileProvider: React.FC = ({ children }) => {
  const [profileState, setProfileState] = useState(getProfileStorage());
  const setProfile = useCallback((profile: ProfileStore) => {
    setProfileStorage(profile);
    setProfileState(getProfileStorage());
  }, []);
  const updateProfile = useCallback((newProfile: Partial<ProfileStore>) => {
    updateProfileStorage(newProfile);
    setProfileState(getProfileStorage());
  }, []);
  return (
    <ProfileContext.Provider
      value={{ profile: profileState, updateProfile, setProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile(): ProfileProviderContext {
  const profileContext = useContext(ProfileContext);
  if (!profileContext)
    throw new Error(
      "useProfile hook is called outside the scope of ProfileProvider"
    );
  return profileContext;
}
