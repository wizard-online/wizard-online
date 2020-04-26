import React from "react";

import { useProfileContext } from "../ProfileProvider";
import { EditProfile } from "./EditProfile";
import { createdProfileEventGA } from "../../analytics";

export const OnBoarding: React.FC = () => {
  const { setProfile } = useProfileContext();
  return (
    <div>
      <h1>Willkommen bei Wizzzzard Online</h1>
      <p>Du kannst gleich loslegen!</p>
      <EditProfile
        onSubmit={(profile) => {
          setProfile(profile);
          createdProfileEventGA();
        }}
        submitLabel="Los geht's!"
      />
    </div>
  );
};
