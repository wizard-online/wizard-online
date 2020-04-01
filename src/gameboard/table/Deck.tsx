import React from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { Suit } from "../../boardgame/entities/cards";
import { PlayCard } from "../components/PlayCard";
import { useGameState } from "../GameContext";
import { isSetRound, Trump } from "../../boardgame/WizardState";
import { cardColors, ColorSet } from "../util/colors";

export const Deck: React.FC = () => {
  const {
    wizardState: { round },
  } = useGameState();
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const trump = round?.trump;
  const color = getColor(trump);
  return (
    <Container>
      <DeckContainer trump={color.text}>
        <CardOutline trump={color.outline}>
          <PlayCard card={trump.card} interactive={false} />
        </CardOutline>
      </DeckContainer>
    </Container>
  );
};

const Container = styled(Box)`
  margin: 25px;
`;

const DeckContainer = styled(Box)<{ trump: string }>`
  transform: rotate(-90deg);
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ trump }) => trump};
  border-radius: 50%;
`;
//
const CardOutline = styled(Box)<{ trump: string }>`
  border-radius: 7px;
  box-shadow: -2px 2px 2px black;
`;

function getColor(trump: Trump): ColorSet {
  switch (trump.suit) {
    case Suit.Blue:
      return cardColors.blue;
    case Suit.Green:
      return cardColors.green;
    case Suit.Red:
      return cardColors.red;
    case Suit.Yellow:
      return cardColors.yellow;
    case null:
      return cardColors.nz;
    // fallback
    default:
      return {
        text: "lightgrey",
        outline: "lightgrey",
        background: "lightgrey",
      };
  }
}
