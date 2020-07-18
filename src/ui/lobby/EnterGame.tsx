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
import { GameRoom } from "../services/api.service";
import { sortGameSeats } from "../util/game-seats";
import { useNotify } from "../NotificationsProvider";
import { copiedGameLinkEventGA } from "../../analytics";

interface EnterGameProps {
  game?: GameRoom;
  joined?: boolean;
  fetchGame(): void;
  onEnterGame(): void;
  canEnterGame: boolean;
  onLeaveGame(): void;
}

export const EnterGame: React.FC<EnterGameProps> = ({
  game,
  joined,
  fetchGame,
  onEnterGame,
  canEnterGame,
  onLeaveGame,
}) => {
  const notify = useNotify();
  useEffect(() => {
    const intervalID = setInterval(fetchGame, 1000);
    return () => clearInterval(intervalID);
  }, [fetchGame]);

  // show loading screen until game is available
  if (!game) {
    return <div>Lade das Spiel...</div>;
  }

  const filledSeats = game.players.filter(({ name }) => !!name);

  return (
    <div>
      <Card>
        <CardContent>
          <h3>Spiel-Einstellungen</h3>
          <ul>
            <li>Anzahl Spieler: {game.players.length}</li>
            <li>
              Wettbewerbsmodus:{" "}
              {game.setupData?.config?.tournamentMode ? "ein" : "aus"}
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
                      } catch (error) {
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
            {filledSeats.length} von {game.players.length} Plätzen belegt
          </h3>

          <SeatList>
            {sortGameSeats(game.players).map(({ id, name }) => (
              <Seat key={id}>{name ?? "_"}</Seat>
            ))}
          </SeatList>
          <div>
            {joined ? (
              <Button onClick={onLeaveGame}>Spiel verlassen</Button>
            ) : (
              <Button
                onClick={onEnterGame}
                disabled={!canEnterGame}
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
