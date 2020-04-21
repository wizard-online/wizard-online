import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";
import { Form } from "../components/Form";
import { useProfileContext } from "../ProfileProvider";

export const InitProfile: React.FC = () => {
  const { setProfile } = useProfileContext();
  const [name, setName] = useState("");
  return (
    <div>
      <h1>Willkommen bei Wizzzzard Online</h1>
      <p>Du kannst gleich loslegen!</p>
      <FormContainer>
        <Form onSubmit={() => setProfile({ name })}>
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
              Los geht&apos;s!
            </Button>
          </FormField>
        </Form>
      </FormContainer>
    </div>
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
