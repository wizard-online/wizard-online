import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import styled from "styled-components";
import { NumPlayers } from "../../game/entities/players";
import { createMatch } from "../services/api.service";
import { Form } from "../components/Form";
import { createdGameEventGA } from "../../analytics";

export const CreateMatch: React.FC = () => {
  const history = useHistory();
  const [numPlayers, setNumPlayers] = useState<NumPlayers>(3);
  const [tournamentMode, setTournamentMode] = useState(false);
  const [inspectPreviousTrick, setInspectPreviousTrick] = useState(false);

  return (
    <div>
      <h1>Starte ein Spiel</h1>
      <FormContainer>
        <Form
          onSubmit={async () => {
            const matchID = await createMatch(numPlayers, {
              config: {
                tournamentMode,
                inspectPreviousTrick,
              },
            });
            history.push(`/matches/${matchID}`);
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
            <FormControlLabel
              label="Wettbewerbs-Modus"
              control={
                <Checkbox
                  checked={tournamentMode}
                  onChange={(event) => setTournamentMode(event.target.checked)}
                />
              }
            />
          </FieldContainer>
          <FieldContainer>
            <FormControlLabel
              label="Letzten Stich betrachten"
              control={
                <Checkbox
                  checked={inspectPreviousTrick}
                  onChange={(event) =>
                    setInspectPreviousTrick(event.target.checked)
                  }
                />
              }
            />
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
