import React from "react";
import { IconButton, Icon } from "@material-ui/core";
import { useProfile, useProfileContext } from "../ProfileProvider";

export const SettingsContainer: React.FC = () => {
  const profile = useProfile();
  const { updateProfile } = useProfileContext();
  const turnAlert = profile.preferences?.turnAlert ?? false;
  return (
    <div>
      <IconButton
        size="small"
        onClick={() =>
          updateProfile({ preferences: { turnAlert: !turnAlert } })
        }
        title="Ton wenn am Zug"
      >
        <Icon fontSize="small">
          {turnAlert ? "notifications" : "notifications_off"}
        </Icon>
      </IconButton>
    </div>
  );
};
