import React from "react";
import { Card as MatCard, CardContent } from "@material-ui/core";
import styled from "styled-components";

import { PlayerMetadata } from "boardgame.io";
import { Phase } from "../../../shared/phases/phase";
import { useGameState } from "../GameContext";
import { ClientHand } from "./ClientHand";
import { Header } from "./Header";

import { colors, ColorTripleTone } from "../util/colors";
import { PlayerProps } from "./Player.props";
import { OpponentHand } from "./OpponentHand";
import { Card } from "../../../shared/entities/cards";
import { HandMeta } from "../../../shared/WizardState";
import { characters } from "../util/character-theme";

export const Player: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer, phase, round, trick },
    clientID,
    matchData,
  } = useGameState();
  const playerData: PlayerMetadata | undefined = (matchData ?? []).find(
    ({ id }) => id === playerID
  );
  const playerColor =
    (playerData?.data?.character &&
      characters[playerData.data.character]?.color) ??
    characters.human.color;
  const isTurn = playerID === currentPlayer;
  const isClient = playerID === clientID;
  return (
    <StyledCard>
      <PlayerContainer $isTurn={isTurn} $color={playerColor}>
        <CardContent>
          <Header playerID={playerID} isTurn={isTurn} isClient={isClient} />
          <HandContainer>
            {round &&
              (isClient ? (
                <ClientHand
                  cards={round.hands[clientID] as Card[]}
                  isPlayTurn={isTurn && phase === Phase.Playing}
                  hasPlayed={
                    !!trick?.cards.find(({ player }) => player === playerID)
                      ?.card
                  }
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

const PlayerContainer = styled.div<{
  $isTurn: boolean;
  $color: ColorTripleTone;
}>`
  flex-grow: 1;
  border-style: solid;
  border-width: ${({ $isTurn }) => ($isTurn ? `3px` : `2px`)};
  border-color: ${({ $color }) => $color.medium};
  background: ${colors.white};
  background: ${({ $color, $isTurn }) =>
    $isTurn
      ? `linear-gradient(0deg, ${$color.light} 0%, ${colors.white} 15%)`
      : "transparent"};
  border-radius: 4px;
`;

const HandContainer = styled.div`
  min-height: 81px;
`;
