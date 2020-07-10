import React from "react";
import { Card as MatCard, CardContent } from "@material-ui/core";
import styled from "styled-components";

import { Phase } from "../../game/phases/phase";
import { useGameState } from "../GameContext";
import { ClientHand } from "./ClientHand";
import { Header } from "./Header";

import { colors } from "../util/colors";
import { PlayerProps } from "./Player.props";
import { OpponentHand } from "./OpponentHand";
import { Card } from "../../game/entities/cards";
import { HandMeta } from "../../game/WizardState";

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
      <PlayerContainer isTurn={isTurn}>
        <CardContent>
          <Header playerID={playerID} isTurn={isTurn} isClient={isClient} />
          <HandContainer>
            {round &&
              (isClient ? (
                <ClientHand
                  cards={round.hands[clientID] as Card[]}
                  isInteractive={isTurn && phase === Phase.Playing}
                  onClickCard={(i) => play(i)}
                  lead={trick?.isComplete ? undefined : trick?.lead}
                  trumpSuit={round.trump.suit}
                  handMeta={round.handsMeta[clientID] as HandMeta}
                />
              ) : (
                <OpponentHand numCards={round.hands[playerID].length} />
              ))}
          </HandContainer>
        </CardContent>
      </PlayerContainer>
    </StyledCard>
  );
};

const StyledCard = styled(MatCard)`
  flex-grow: 1;
  display: flex;
`;

const PlayerContainer = styled.div<{ isTurn: boolean }>`
  flex-grow: 1;
  border-style: solid;
  border-width: ${({ isTurn }) => (isTurn ? `2px` : `1px`)};
  border-color: ${({ isTurn }) =>
    isTurn ? colors.red.medium : colors.wizard.green};
  border-radius: 4px;
`;

const HandContainer = styled.div`
  min-height: 81px;
`;
