import React, { useContext } from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { Suit, Card } from "../../boardgame/entities/cards";
import { PlayCard, PlayCardColor } from "../components/PlayCard";
import { GameContext } from "../GameContext";
import { isSetRound } from "../../boardgame/G";

export const Deck: React.FC = () => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;
  const {
    G: { round },
  } = gamestate;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const trump = round?.trump;
  const color = getColor(trump);
  return (
    <Container>
      <DeckContainer trump={color}>
        <PlayCard card={trump || null} interactive={false} />
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

function getColor(trump?: Card | null): string {
  if (!trump) return "lightgrey";
  switch (trump.suit) {
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
