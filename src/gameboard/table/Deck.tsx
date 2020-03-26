import React, { useContext } from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { Suit } from "../../boardgame/entities/cards";
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
    throw Error("round is not set");
  }

  const { trump } = round;
  const color = getColor(trump?.suit);
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
  transform: rotate(-90deg);
  width: 80px;
  height: 80px;
`;

const DeckContainer = styled(Box)<{ trump: string }>`
  display: inline-block;
  border: 2px solid ${({ trump }) => trump};
  border-radius: 5px;
`;

function getColor(suit?: Suit): string {
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
