import React from "react";
import ReactGA from "react-ga";

import { useProfileContext } from "../ProfileProvider";
import { EditProfile } from "./EditProfile";

export const OnBoarding: React.FC = () => {
  const { setProfile } = useProfileContext();
  return (
    <div>
      <h1>Willkommen bei Wizzzzard Online</h1>
      <p>Du kannst gleich loslegen!</p>
      <EditProfile
        onSubmit={(profile) => {
          setProfile(profile);
          ReactGA.event({
            category: "User",
            action: "Created new user profile",
          });
        }}
        submitLabel="Los geht's!"
      />
    </div>
  );
};
