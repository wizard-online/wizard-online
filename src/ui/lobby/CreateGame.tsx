import React, { useState } from "react";
import { Select, MenuItem, Button } from "@material-ui/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { NumPlayers } from "../../game/entities/players";
import { createGame } from "../services/api.service";
import { Form } from "../components/Form";

export const CreateGame: React.FC = () => {
  const history = useHistory();
  const [numPlayers, setNumPlayers] = useState<NumPlayers>(3);
  return (
    <div>
      <h1>Starte ein Spiel</h1>
      <FormContainer>
        <Form
          onSubmit={async () => {
            const gameID = await createGame(numPlayers);
            history.push(`/games/${gameID}`);
          }}
        >
          <FieldContainer>
            <StyledSelect
              value={numPlayers}
              onChange={(event) =>
                setNumPlayers(event.target.value as NumPlayers)
              }
              placeholder="Anzahl der Spieler"
            >
              {[3, 4, 5, 6].map((num) => (
                <MenuItem value={num} key={num}>
                  {num} Spieler
                </MenuItem>
              ))}
            </StyledSelect>
          </FieldContainer>
          <FieldContainer>
            <Button type="submit" color="primary" variant="contained">
              Spiel starten
            </Button>
          </FieldContainer>
        </Form>
      </FormContainer>
    </div>
  );
};

const FormContainer = styled.div`
  min-width: 200px;
  max-width: 400px;
`;

const FieldContainer = styled.div`
  margin: 10px;
  display: flex;
`;

const StyledSelect = styled(Select)`
  flex-grow: 1;
`;
