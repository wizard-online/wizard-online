import React from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { Suit } from "../../boardgame/entities/cards";
import { PlayCard, PlayCardColor } from "../components/PlayCard";
import { useGameState } from "../GameContext";
import { isSetRound, Trump } from "../../boardgame/WizardState";

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
      <DeckContainer trump={color}>
        <PlayCard card={trump.card} interactive={false} />
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

function getColor(trump: Trump): string {
  switch (trump.suit) {
    case Suit.Blue:
      return PlayCardColor.Blue;
    case Suit.Green:
      return PlayCardColor.Green;
    case Suit.Red:
      return PlayCardColor.Red;
    case Suit.Yellow:
      return PlayCardColor.Yellow;
    case null:
      return PlayCardColor.Black;
    // fallback
    default:
      return "lightgrey";
  }
}
