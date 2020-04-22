import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";
import { Form } from "../components/Form";
import { useProfileContext } from "../ProfileProvider";
import { ProfileStore } from "../services/profile.service";

export interface EditProfileProps {
  onSubmit(profile: ProfileStore): void;
  submitLabel: string;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  onSubmit,
  submitLabel,
}) => {
  const { profile } = useProfileContext();
  const [name, setName] = useState(profile?.name ?? "");
  return (
    <FormContainer>
      <Form onSubmit={() => onSubmit({ name })}>
        <h3>Spieler-Name</h3>
        <FormField>
          <TextField
            label="Name"
            required
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>
        <FormField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!name}
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