import React from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { cardColors, ColorSet } from "../../boardgame/util/colors";
import { Card, Rank, Suit } from "../../boardgame/entities/cards";

export interface PlayCardProps {
  card: Card | null;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

// css colors
export enum PlayCardColor {
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
    return <BacksideCardBox>Wizard</BacksideCardBox>;
  }
  const colorSet = getColor(card);
  const label = getLabel(card);

  const guardedOnClick = (): void => {
    if (!disabled) onClick();
  };

  return (
    <FronsideCardBox
      onClick={guardedOnClick}
      isPlayable={interactive}
      isDisabled={disabled}
      colorSet={colorSet}
    >
      <span>{label}</span>
    </FronsideCardBox>
  );
};

const StaticCardBox = styled(Box)`
  border: 1px solid grey;
  border-radius: 7px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 66px;
  font-family: "Almendra", serif;
  font-weight: 700;
`;

const BacksideCardBox = styled(StaticCardBox)`
  font-size: 15px;
  background-color: ${cardColors.back.background};
  color: ${cardColors.back.outline};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${cardColors.back.text};
  -webkit-text-stroke: 1px ${cardColors.back.outline};
  text-shadow: 0 0 8px ${cardColors.back.shadow};
`;

const FronsideCardBox = styled(StaticCardBox)<{
  colorSet: ColorSet;
  isPlayable: boolean;
  isDisabled: boolean;
}>`
  font-size: 36px;
  font-weight: bold;
  /* colors */
  background-color: ${({ colorSet }) => colorSet.background};
  color: ${({ colorSet }) => colorSet.outline};
  /* cool outline effect only supported with prefix */
  -webkit-text-fill-color: ${({ colorSet }) => colorSet.text};
  -webkit-text-stroke: 2px ${({ colorSet }) => colorSet.outline};
  ${({ isPlayable, isDisabled }) =>
    isPlayable && !isDisabled
      ? `cursor: pointer;
    transition: transform 0.3s;
    &:hover {
      transform: translate(0, -10px);
    }`
      : ""}
  ${({ isDisabled }) =>
    isDisabled
      ? `
  background-color: #ffffff;
  `
      : ""}
  & span {
    border-bottom: 2px solid ${({ colorSet }) => colorSet.text};
  }
`;

function getColor({ rank, suit }: Card): ColorSet {
  if (rank === Rank.Z || rank === Rank.N) {
    return cardColors.zn;
  }
  switch (suit) {
    case Suit.Blue:
      return cardColors.blue;
    case Suit.Green:
      return cardColors.green;
    case Suit.Red:
      return cardColors.red;
    case Suit.Yellow:
      return cardColors.yellow;
    // fallback
    default:
      return cardColors.zn;
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
