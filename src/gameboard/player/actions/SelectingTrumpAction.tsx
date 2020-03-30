import React, { useState } from "react";
import {
  Box,
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
import { PlayCardColor } from "../../components/PlayCard";
import { isSetRound } from "../../../boardgame/WizardState";

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

const ButtonContainer = styled(Box)`
  height: 40px;
  margin: 10px 0;
`;

const SuitColoredRadio = styled(Radio)<{ suit: Suit }>`
  &.MuiRadio-root {
    color: ${({ suit }) => getColor(suit)};
  }
`;

function getColor(suit: Suit): PlayCardColor {
  switch (suit) {
    case Suit.Blue:
      return PlayCardColor.Blue;
    case Suit.Green:
      return PlayCardColor.Green;
    case Suit.Red:
      return PlayCardColor.Red;
    case Suit.Yellow:
      return PlayCardColor.Yellow;
    // fallback
    default:
      return PlayCardColor.Black;
  }
}
