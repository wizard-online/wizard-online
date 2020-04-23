import React from "react";

import { useProfileContext } from "../ProfileProvider";
import { EditProfile } from "./EditProfile";

export const OnBoarding: React.FC = () => {
  const { setProfile } = useProfileContext();
  return (
    <div>
      <h1>Willkommen bei Wizzzzard Online</h1>
      <p>Du kannst gleich loslegen!</p>
      <EditProfile
        onSubmit={(profile) => setProfile(profile)}
        submitLabel="Los geht's!"
      />
    </div>
  );
};
