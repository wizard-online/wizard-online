import React, { useContext, useState } from "react";
import { Box, FormControl, Button, Slider } from "@material-ui/core";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { PlayerProps } from "./Player.props";
import { isValidBid } from "../../boardgame/util/bid";
import { isSetRound } from "../../boardgame/G";

export const PlayerOnBidding: React.FC<PlayerProps> = ({ playerID }) => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;
  const {
    G: {
      game: { numCards },
      round,
    },
    ctx: { currentPlayer },
    moves: { bid },
  } = gamestate;
  if (!isSetRound(round)) {
    throw Error("round is not set");
  }
  const [bidValue, setBidValue] = useState(0);
  const valid = isValidBid(bidValue, numCards, round.bids, currentPlayer);
  const isTurn = currentPlayer === playerID;
  return (
    <Box>
      {isTurn ? (
        <form>
          <Field>
            <Slider
              value={bidValue}
              onChange={(_, newValue) => setBidValue(newValue as number)}
              step={1}
              min={0}
              max={numCards}
              marks
              valueLabelDisplay="auto"
            />
          </Field>
          <Field>
            <Button
              onClick={() => {
                if (valid) bid(bidValue);
              }}
              type="button"
              disabled={!valid}
            >
              Ansagen
            </Button>
          </Field>
        </form>
      ) : (
        <span>Warten auf Spieler {currentPlayer}</span>
      )}
    </Box>
  );
};

const Field = styled(FormControl)`
  width: 300px;
`;
