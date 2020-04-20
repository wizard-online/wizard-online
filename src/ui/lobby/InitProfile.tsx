import React from "react";
import {
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
} from "@material-ui/core";
import styled from "styled-components";
import {
  handOrderPreferences,
  getHandOrderPreferenceLabel,
} from "../services/profile.service";

export const InitProfile: React.FC = () => {
  return (
    <div>
      <h1>Willkommen bei Wizzzzard Online</h1>
      <p>Du kannst gleich loslegen!</p>
      <Form>
        <h3>Spieler-Name</h3>
        <FormField>
          <TextField label="Name" required fullWidth />
        </FormField>
        <h3>Persönliche Voreinstellungen</h3>
        <FormField>
          <FormControl fullWidth>
            <InputLabel>Handkarten-Sortierung</InputLabel>
            <Select value={null} onChange={() => {}}>
              {handOrderPreferences.map((handOrderPreference) => (
                <MenuItem value={handOrderPreference}>
                  {getHandOrderPreferenceLabel(handOrderPreference)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormField>
        <FormField>
          <Button type="submit" variant="contained" color="primary">
            Los geht&apos;s!
          </Button>
        </FormField>
      </Form>
    </div>
  );
};

const Form = styled.form`
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
