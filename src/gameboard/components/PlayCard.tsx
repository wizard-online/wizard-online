import React from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { Card, Rank, Suit } from "../../boardgame/entities/cards";

export interface PlayCardProps {
  card: Card | null;
  interactive: boolean;
  disabled: boolean;
  onClick?: () => void;
}

// css colors
enum PlayCardColor {
  Black = "black",
  Blue = "blue",
  Green = "green",
  Red = "red",
  Yellow = "yellow",
}

export const PlayCard: React.FC<PlayCardProps> = ({
  card,
  interactive = true,
  disabled = false,
  onClick = () => {},
}) => {
  if (!card) {
    return <StaticCardBox>&#10060;</StaticCardBox>;
  }
  const color = getColor(card);
  const label = getLabel(card);

  const cardContent = (
    <CardText color={color}>
      {label}
      {interactive && "P"}
    </CardText>
  );

  const guardedOnClick = (): void => {
    if (!disabled) onClick();
  };

  if (interactive && !disabled)
    return (
      <PlayableCardBox onClick={guardedOnClick}>{cardContent}</PlayableCardBox>
    );
  if (disabled) return <NonPlayableCardBox>{cardContent}</NonPlayableCardBox>;
  return <StaticCardBox>{cardContent}</StaticCardBox>;
};

const StaticCardBox = styled(Box)`
  border: 1px solid grey;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 66px;
`;

const PlayableCardBox = styled(StaticCardBox)`
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: translate(0, -10px);
  }
`;

const NonPlayableCardBox = styled(StaticCardBox)`
  background-color: lightgrey;
`;

const CardText = styled.span<{ color: PlayCardColor }>`
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: 14px;
`;

function getColor({ rank, suit }: Card): PlayCardColor {
  if (rank === Rank.Z || rank === Rank.N) return PlayCardColor.Black;
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

function getLabel({ rank }: Card): string {
  switch (rank) {
    case Rank.Z:
      return "Z";
    case Rank.N:
      return "N";
    default:
      return rank.toString();
  }
}
