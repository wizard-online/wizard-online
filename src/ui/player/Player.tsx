import React from "react";
import { Card, CardContent } from "@material-ui/core";
import styled from "styled-components";

import { Phase } from "../../game/phases/phase";
import { useGameState } from "../GameContext";
import { ClientHand } from "./ClientHand";
import { Header } from "./Header";

import { colors } from "../util/colors";
import { PlayerProps } from "./Player.props";
import { OpponentHand } from "./OpponentHand";

export const Player: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer, phase, round, trick },
    clientID,
    moves: { play },
  } = useGameState();

  const isTurn = playerID === currentPlayer;
  const isClient = playerID === clientID;

  return (
    <StyledCard>
      <CardContent>
        <Header playerID={playerID} isTurn={isTurn} isClient={isClient} />
        <HandContainer>
          {round &&
            (isClient ? (
              <ClientHand
                cards={round.hands[clientID]}
                isInteractive={isTurn && phase === Phase.Playing}
                onClickCard={(i) => play(i)}
                lead={trick?.lead}
              />
            ) : (
              <OpponentHand numCards={round.hands[playerID].length} />
            ))}
        </HandContainer>
      </CardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  border: 1px solid ${colors.wizard.green};
  flex-grow: 1;
`;

const HandContainer = styled(CardContent)`
  min-height: 90px;
`;
