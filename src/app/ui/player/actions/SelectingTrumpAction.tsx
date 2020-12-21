import React, { useState } from "react";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Button,
} from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../../GameContext";
import { getSuitLabel } from "../../../../shared/entities/cards.utils";
import { isSetRound } from "../../../../shared/WizardState";
import { colors } from "../../util/colors";
import { allSuits, Suit } from "../../../../shared/entities/cards";

export const SelectingTrumpAction: React.FC = () => {
  const {
    wizardState: { round },
    moves: { selectTrump },
  } = useGameState();
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);

  return (
    <Row>
      <FormControl component="fieldset">
        <FormLabel component="legend">Wähle eine Trumpf-Farbe</FormLabel>
        <StyledRadioGroup
          row
          value={selectedSuit}
          onChange={(event) => setSelectedSuit(event.target.value as Suit)}
        >
          {allSuits.map((suit) => (
            <FormControlLabel
              value={suit}
              control={<SuitColoredRadio suit={suit} />}
              label={getSuitLabel(suit)}
              key={suit}
            />
          ))}
        </StyledRadioGroup>
      </FormControl>
      {selectedSuit && (
        <FormControl>
          <Button
            color="primary"
            variant="contained"
            disabled={!selectedSuit}
            onClick={() => selectTrump(selectedSuit)}
          >
            {getSuitLabel(selectedSuit)} als Trumpf wählen
          </Button>
        </FormControl>
      )}
    </Row>
  );
};

const Row = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 10px;
`;

const SuitColoredRadio = styled(Radio)<{ suit: Suit }>`
  &.MuiRadio-root {
    color: ${({ suit }) => getColor(suit)};
  }
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-bottom: -3px;
`;

function getColor(suit: Suit): string {
  switch (suit) {
    case Suit.Blue:
      return colors.blue.medium;
    case Suit.Green:
      return colors.green.medium;
    case Suit.Red:
      return colors.red.medium;
    case Suit.Yellow:
      return colors.yellow.medium;
    // fallback
    default:
      return colors.black;
  }
}
