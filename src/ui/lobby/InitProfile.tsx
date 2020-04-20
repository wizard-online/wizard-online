import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import styled from "styled-components";
import { setProfile } from "../services/profile.service";

export const InitProfile: React.FC = () => {
  const [name, setName] = useState("");
  return (
    <div>
      <h1>Willkommen bei Wizzzzard Online</h1>
      <p>Du kannst gleich loslegen!</p>
      <Form
        onSubmit={(event) => {
          setProfile({ name });
          event.preventDefault();
        }}
      >
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
