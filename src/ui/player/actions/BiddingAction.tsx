import React, { useState } from "react";
import { FormControl, Button, Slider } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../../GameContext";
import { isValidBid } from "../../../game/entities/bid.utils";
import { isSetRound } from "../../../game/WizardState";

export const BiddingAction: React.FC = () => {
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

  const [isHandSorted, setIsHandSorted] = useState(false);

  return (
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
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`;

const Field = styled(FormControl)`
  width: 300px;
`;
