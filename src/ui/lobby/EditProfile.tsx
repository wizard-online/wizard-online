import React, { useState, useCallback } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import styled from "styled-components";
import merge from "lodash/merge";
import { Form } from "../components/Form";
import {
  ProfileStore,
  HandOrderPreference,
  initializePreferences,
} from "../services/profile.service";

export interface EditProfileProps {
  defaultProfile?: ProfileStore;
  onSubmit(profile: ProfileStore): void;
  submitLabel: string;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  defaultProfile,
  onSubmit,
  submitLabel,
}) => {
  const [profile, setProfile] = useState(
    defaultProfile ?? { name: "", preferences: {} }
  );

  const updateProfile = useCallback((changes: Partial<ProfileStore>) => {
    setProfile((previousProfile) => merge({}, previousProfile, changes));
  }, []);
  return (
    <FormContainer>
      <Form onSubmit={() => onSubmit(profile)}>
        <h3>Spieler-Name</h3>
        <FormField>
          <TextField
            label="Name"
            required
            fullWidth
            value={profile.name}
            onChange={(event) => updateProfile({ name: event.target.value })}
          />
        </FormField>
        <h3>Einstellungen</h3>
        <FormField>
          <FormControlLabel
            label="Ton wenn am Zug"
            control={
              <Checkbox
                checked={profile.preferences?.turnAlert ?? false}
                onChange={(event) =>
                  updateProfile({
                    preferences: { turnAlert: event.target.checked },
                  })
                }
              />
            }
          />
        </FormField>
        <FormField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!profile}
          >
            {submitLabel}
          </Button>
        </FormField>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  width: 450px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const FormField = styled.div`
  display: flex;
  margin: 10px;
`;
