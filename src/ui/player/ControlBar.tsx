import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconButton } from "@material-ui/core";
import styled from "styled-components";
import { useProfile, useProfileContext } from "../ProfileProvider";
import { MetaHandOrderPreferences } from "../services/profile.service";

export const ControlBar: React.FC = () => {
  const { updateProfile } = useProfileContext();
  const { preferences } = useProfile();
  const indexOfOrderPreference = MetaHandOrderPreferences.findIndex(
    (element) => element.handOrderPreference === preferences.handOrderPreference
  );

  const { label, icon } = MetaHandOrderPreferences[indexOfOrderPreference];

  return (
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
            handOrderPreference,
          },
        });
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </StyledIconButton>
  );
};

const StyledIconButton = styled(IconButton)`
  width: 35px;
`;
