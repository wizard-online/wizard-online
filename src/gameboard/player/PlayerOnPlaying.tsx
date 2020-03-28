import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { PlayerProps } from "./Player.props";
import { isSetRound } from "../../boardgame/G";
import { PlayCard } from "../components/PlayCard";
import { playableCardsInHand } from "../../boardgame/entities/cards";

export const PlayerOnPlaying: React.FC<PlayerProps> = ({ playerID }) => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;
  const {
    G: {
      round,
      trick,
      game: { currentPlayer },
    },
    moves: { play },
  } = gamestate;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  const isTurn = currentPlayer === playerID;
  const cards = round.hands[playerID];
  const visibleCards = cards.map((card) => (isTurn ? card : null));
  const playableCards = playableCardsInHand(cards, trick?.lead || null);
  return (
    <Container>
      <p>playing...</p>
      {visibleCards.map((card, i) => (
        <PlayingCardContainer key={`${cards[i].suit}-${cards[i].rank}`}>
          <PlayCard
            card={card}
            interactive={isTurn}
            disabled={!playableCards[i]}
            onClick={() => play(i)}
          />
        </PlayingCardContainer>
      ))}
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayingCardContainer = styled(Box)`
  margin: 5px;
`;
