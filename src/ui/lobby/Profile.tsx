import React from "react";
import { useProfileContext } from "../ProfileProvider";
import { EditProfile } from "./EditProfile";
import { useNotify } from "../NotificationsProvider";

export const Profile: React.FC = () => {
  const { updateProfile, profile } = useProfileContext();
  const notify = useNotify();
  return (
    <div>
      <h1>Dein Wizzzzard-Profil</h1>
      <p>Ändere deinen Spielernamen oder deine Einstellungen.</p>
      <EditProfile
        defaultProfile={profile}
        onSubmit={(newProfile) => {
          updateProfile(newProfile);
          notify({ message: "Änderungen wurden gespeichert!" });
        }}
        submitLabel="Speichern"
      />
    </div>
  );
};
