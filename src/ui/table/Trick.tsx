import React from "react";
import styled from "styled-components";
import { OptionalTrickCard } from "../../game/entities/trick";
import { TrickCardBox } from "./TrickCardBox";
import { PlayCard } from "../components/playcard/PlayCard";
import { useGameState } from "../GameContext";
import { getPlayerName } from "../../game/entities/players.utils";
import { PlayerID } from "../../game/entities/players";

export interface TrickProps {
  cards: OptionalTrickCard[];
  winningPlayerID?: PlayerID;
}

export const Trick: React.FC<TrickProps> = ({ cards, winningPlayerID }) => {
  const { matchData } = useGameState();
  return (
    <Container>
      {cards.map(({ card, player }) => (
        <TrickCardBox
          player={getPlayerName(player, matchData)}
          isWinning={player === winningPlayerID}
          key={player}
        >
          <PlayCard card={card} interactive={false} />
        </TrickCardBox>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;
