import React, { useState } from "react";
import { Select, MenuItem, Button } from "@material-ui/core";
import styled from "styled-components";
import { NumPlayers } from "../../game/entities/players";
import { createGame } from "../services/api.service";

export const CreateGame: React.FC = () => {
  const [numPlayers, setNumPlayers] = useState<NumPlayers>(3);
  return (
    <div>
      <h1>Starte ein Spiel</h1>
      <Form
        onSubmit={async (event) => {
          event.preventDefault();
          const gameID = await createGame(numPlayers);
          console.log("created game", gameID);
          // TODO: implement routing to game component
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
    </div>
  );
};

const Form = styled.form`
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
