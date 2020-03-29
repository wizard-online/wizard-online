import React, { useContext, useState } from "react";
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
import { GameContext } from "../GameContext";
import { allSuits, Suit, getSuitLabel } from "../../boardgame/entities/cards";
import { PlayCard, PlayCardColor } from "../components/PlayCard";
import { PlayerProps } from "./Player.props";
import { isSetRound } from "../../boardgame/WizardState";

export const PlayerOnSelectingTrump: React.FC<PlayerProps> = ({ playerID }) => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;
  const {
    G: { round, currentPlayer },
    moves: { selectTrump },
  } = gamestate;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  const isTurn = currentPlayer === playerID;
  const cards = round.hands[playerID];

  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);

  return (
    <Box>
      {isTurn && (
        <form>
          <h5>Wähle eine Trump-Farbe</h5>
          <FormControl component="fieldset">
            <FormLabel component="legend">Trump-Farbe</FormLabel>
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
          {selectedSuit && (
            <FormControl>
              <Button
                disabled={!selectedSuit}
                onClick={() => selectTrump(selectedSuit)}
              >
                {getSuitLabel(selectedSuit)} als Trumpf wählen
              </Button>
            </FormControl>
          )}
        </form>
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

const CardsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayingCardContainer = styled(Box)`
  margin: 5px;
`;

// const SuitColoredRadio = withStyles({
//   root: {
//     color: "pink",
//     "&$checked": {
//       color: "red",
//     },
//   },
//   checked: {},
// })((props) => <Radio color="default" {...props} />);

const SuitColoredRadio = styled(Radio)<{ suit: Suit }>`
  &.MuiRadio-root {
    color: ${({ suit }) => getColor(suit)};
    /* &.Mui-checked {
      color: green;
    } */
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
