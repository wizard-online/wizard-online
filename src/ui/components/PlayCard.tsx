import React from "react";
import styled from "styled-components";
import { cardColors, ColorSet, colors } from "../util/colors";
import { Card, Rank, Suit } from "../../game/entities/cards";
import { getCardLabel, getRankLabel } from "../../game/entities/cards.utils";

export interface PlayCardProps {
  card: Card | null;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
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
  const label = getRankLabel(card);

  const guardedOnClick = (): void => {
    if (!disabled) onClick();
  };

  return (
    <FronsideCardBox
      onClick={guardedOnClick}
      isplayable={interactive}
      isdisabled={disabled}
      colorSet={colorSet}
      aria-label={getCardLabel(card)}
    >
      <span>{label}</span>
    </FronsideCardBox>
  );
};

const StaticCardBox = styled.div`
  border: 1px solid ${colors.grey};
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
  font-style: italic;
  background-color: ${cardColors.back.background};
  color: ${cardColors.back.outline};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${cardColors.back.text};
  -webkit-text-stroke: 1px ${cardColors.back.outline};
  text-shadow: 0 0 8px ${cardColors.back.shadow};
`;

const FronsideCardBox = styled(StaticCardBox)<{
  colorSet: ColorSet;
  isplayable: boolean;
  isdisabled: boolean;
}>`
  font-size: 36px;
  font-weight: bold;
  /* colors */
  background-color: ${({ colorSet }) => colorSet.background};
  color: ${({ colorSet }) => colorSet.outline};
  /* cool outline effect only supported with prefix */
  -webkit-text-fill-color: ${({ colorSet }) => colorSet.text};
  -webkit-text-stroke: 2px ${({ colorSet }) => colorSet.outline};
  ${({ isplayable, isdisabled }) =>
    isplayable && !isdisabled
      ? `cursor: pointer;
    transition: transform 0.3s;
    &:hover {
      transform: translate(0, -10px);
    }`
      : ""}
  ${({ isdisabled: isDisabled }) =>
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
