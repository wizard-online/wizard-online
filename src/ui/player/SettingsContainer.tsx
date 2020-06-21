import React from "react";
import { IconButton, Icon } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useProfile, useProfileContext } from "../ProfileProvider";
import { MetaHandOrderPreferences } from "../services/profile.service";

export const SettingsContainer: React.FC = () => {
  const profile = useProfile();
  const { updateProfile } = useProfileContext();
  const { preferences } = useProfile();
  const turnAlert = profile.preferences?.turnAlert ?? false;
  const indexOfOrderPreference = MetaHandOrderPreferences.findIndex(
    (element) => element.handOrderPreference === preferences?.handOrder
  );

  const { label, icon } = MetaHandOrderPreferences[indexOfOrderPreference];

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
      <StyledIconButton
        title={label}
        size="small"
        onClick={() => {
          const { handOrderPreference } = MetaHandOrderPreferences[
            (indexOfOrderPreference + 1) % MetaHandOrderPreferences.length
          ];
          updateProfile({
            preferences: {
              ...preferences,
              handOrder: handOrderPreference,
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
