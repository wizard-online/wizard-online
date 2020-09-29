import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Icon,
} from "@material-ui/core";
import styled from "styled-components";
import { Match } from "../services/api.service";
import { sortMatchSeats } from "../util/match-seats";
import { useNotify } from "../NotificationsProvider";
import { copiedGameLinkEventGA } from "../../analytics";

interface EnterMatchProps {
  match?: Match;
  joined?: boolean;
  fetchMatch(): void;
  onEnterMatch(): void;
  canEnterMatch: boolean;
  onLeaveMatch(): void;
}

export const EnterMatch: React.FC<EnterMatchProps> = ({
  match,
  joined,
  fetchMatch,
  onEnterMatch,
  canEnterMatch,
  onLeaveMatch,
}) => {
  const notify = useNotify();
  useEffect(() => {
    const intervalID = setInterval(fetchMatch, 1000);
    return () => clearInterval(intervalID);
  }, [fetchMatch]);

  // show loading screen until match is available
  if (!match) {
    return <div>Lade das Spiel...</div>;
  }

  const filledSeats = match.players.filter(({ name }) => !!name);

  return (
    <div>
      <Card>
        <CardContent>
          <h3>Spiel-Einstellungen</h3>
          <ul>
            <li>Anzahl Spieler: {match.players.length}</li>
            <li>
              Wettbewerbsmodus:{" "}
              {match.setupData?.config?.tournamentMode ? "ein" : "aus"}
            </li>
          </ul>
        </CardContent>
      </Card>
      <Spacer />

      <Card>
        <CardContent>
          <h3>Freunde einladen</h3>
          <p>Teile den Link um mit deinen Freunden zu spielen:</p>
          <TextField
            value={window.location.href}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="start">
                  <Button
                    startIcon={<Icon>file_copy</Icon>}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          window.location.href
                        );
                        notify({
                          message: "Link wurde in die Zwischenablage kopiert",
                          icon: "done",
                        });
                        copiedGameLinkEventGA();
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    Kopieren
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
      <Spacer />

      <Card>
        <CardContent>
          <h3>
            {filledSeats.length} von {match.players.length} Plätzen belegt
          </h3>

          <SeatList>
            {sortMatchSeats(match.players).map(({ id, name }) => (
              <Seat key={id}>{name ?? "_"}</Seat>
            ))}
          </SeatList>
          <div>
            {joined ? (
              <Button onClick={onLeaveMatch}>Spiel verlassen</Button>
            ) : (
              <Button
                onClick={onEnterMatch}
                disabled={!canEnterMatch}
                color="primary"
                variant="contained"
              >
                Spiel beitreten
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Spacer = styled.div`
  margin: 15px 0;
`;

const SeatList = styled.ul`
  list-style-type: none;
`;

const Seat = styled.li``;
