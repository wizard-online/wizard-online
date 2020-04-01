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
import {
  allSuits,
  Suit,
  getSuitLabel,
} from "../../../boardgame/entities/cards";
import { isSetRound } from "../../../boardgame/WizardState";
import { colors } from "../../util/colors";

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
    <form>
      <FormControl component="fieldset">
        <FormLabel component="legend">Wähle eine Trumpf-Farbe</FormLabel>
        <RadioGroup
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
        </RadioGroup>
      </FormControl>
      <ButtonContainer>
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
      </ButtonContainer>
    </form>
  );
};

const ButtonContainer = styled.div`
  height: 40px;
  margin: 10px 0;
`;

const SuitColoredRadio = styled(Radio)<{ suit: Suit }>`
  &.MuiRadio-root {
    color: ${({ suit }) => getColor(suit)};
  }
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
