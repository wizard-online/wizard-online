import React from "react";
import styled from "styled-components";
import { Card, Rank, Suit } from "../../boardgame/entities/cards";

export interface PlayCardProps {
  card: Card;
}

// css colors
enum PlayCardColor {
  Black = "black",
  Blue = "blue",
  Green = "green",
  Red = "red",
  Yellow = "yellow",
}

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

export const PlayCard: React.FC<PlayCardProps> = ({ card }) => {
  const color = getColor(card);
  const label = getLabel(card);

  return <CardText color={color}>{label}</CardText>;
};

const CardText = styled.span<{ color: PlayCardColor }>`
  color: ${({ color }) => color};
`;
