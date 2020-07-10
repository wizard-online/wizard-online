import React from "react";
import { IconButton, Icon } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useProfile, useProfileContext } from "../ProfileProvider";
import {
  MetaHandOrderPreferences,
  getNextHandOrderPreference,
} from "../services/profile.service";
import { useAlertClient } from "../hooks/alert-client-turn";

export const SettingsContainer: React.FC = () => {
  const profile = useProfile();
  const { updateProfile } = useProfileContext();
  const { preferences } = useProfile();
  const turnAlert = profile.preferences.turnAlert ?? false;
  const alertClient = useAlertClient();

  const { label, icon, handOrderPreference } =
    MetaHandOrderPreferences.find(
      (element) => element.handOrderPreference === preferences.handOrder
    ) ?? MetaHandOrderPreferences[0];

  return (
    <div>
      <IconButton
        size="small"
        onClick={() => {
          updateProfile({ preferences: { turnAlert: !turnAlert } });
          // if alert is going to be enabled, play alert sound
          if (!turnAlert) {
            alertClient();
          }
        }}
        title="Ton wenn am Zug"
      >
        <Icon fontSize="small">
          {turnAlert ? "notifications" : "notifications_off"}
        </Icon>
      </IconButton>
      <StyledIconButton
        title={label}
        size="small"
        onClick={() => {
          const { handOrderPreference: handOrder } = getNextHandOrderPreference(
            handOrderPreference
          );
          updateProfile({
            preferences: {
              ...preferences,
              handOrder,
            },
          });
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </StyledIconButton>
    </div>
  );
};

const StyledIconButton = styled(IconButton)`
  width: 35px;
`;
