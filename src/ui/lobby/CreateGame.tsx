import React, { useState } from "react";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { Select, MenuItem, Button, Link } from "@material-ui/core";
import styled from "styled-components";
import { NumPlayers } from "../../game/entities/players";
import { createGame } from "../services/api.service";
import { Form } from "../components/Form";
import { createdGameEventGA } from "../../analytics";

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
            createdGameEventGA(numPlayers);
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
      <Link component={RouterLink} to="/games">
        Alle Spiele anzeigen
      </Link>
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
