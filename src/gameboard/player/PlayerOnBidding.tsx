import React, { useState } from "react";
import { Box, FormControl, Button, Slider } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { PlayerProps } from "./Player.props";
import { isValidBid } from "../../boardgame/util/bid";
import { isSetRound } from "../../boardgame/WizardState";
import { PlayCard } from "../components/PlayCard";

export const PlayerOnBidding: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { numCards, currentPlayer, round },
    moves: { bid, sortCards },
  } = useGameState();

  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  const { bids } = round;
  const [bidValue, setBidValue] = useState(0);
  const valid = isValidBid(bidValue, numCards, bids, currentPlayer);
  const isTurn = currentPlayer === playerID;

  const [isHandSorted, setIsHandSorted] = useState(false);

  const cards = round.hands[playerID];

  return (
    <Box>
      {isTurn ? (
        <form>
          <Row>
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
          </Row>
          <Row>
            <Button
              onClick={() => {
                sortCards();
                setIsHandSorted(true);
              }}
              type="button"
              disabled={isHandSorted}
            >
              Karten sortieren
            </Button>
            <Button
              onClick={() => {
                if (valid) bid(bidValue);
              }}
              type="button"
              disabled={!valid}
              color="primary"
              variant="contained"
            >
              {bidValue} Stiche ansagen
            </Button>
          </Row>
        </form>
      ) : (
        <span>Warten auf Spieler {currentPlayer}</span>
      )}
      <CardsContainer>
        {cards.map((card) => (
          <PlayingCardContainer key={`${card.suit}-${card.rank}`}>
            <PlayCard card={isTurn ? card : null} interactive={false} />
          </PlayingCardContainer>
        ))}
      </CardsContainer>
    </Box>
  );
};

const Row = styled(Box)`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const Field = styled(FormControl)`
  width: 300px;
`;

const CardsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayingCardContainer = styled(Box)`
  margin: 5px;
`;
