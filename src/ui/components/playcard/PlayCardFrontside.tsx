import React from "react";
import styled, { css } from "styled-components";
import { playCardBaseStyles } from "./playcard.styles";
import { ColorSet } from "../../util/colors";
import { getColor } from "./playcard.utils";
import {
  getRankLabel,
  getCardLabel,
  getCardId,
} from "../../../game/entities/cards.utils";
import { Card } from "../../../game/entities/cards";

export interface PlayCardFrontsideProps {
  card: Card;
  interactive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const PlayCardFrontside: React.FC<PlayCardFrontsideProps> = ({
  card,
  interactive = true,
  disabled = false,
  onClick = () => {},
}) => {
  const colorSet = getColor(card);
  const label = getRankLabel(card);
  const guardedOnClick = (): void => {
    if (interactive && !disabled) onClick();
  };
  return (
    <FronsideCardBox
      onClick={guardedOnClick}
      isplayable={interactive}
      isdisabled={disabled}
      colorSet={colorSet}
      aria-label={getCardLabel(card)}
      data-testid={getCardId(card)}
    >
      <span>{label}</span>
    </FronsideCardBox>
  );
};

interface FrontsideCardBoxProps {
  colorSet: ColorSet;
  isplayable: boolean;
  isdisabled: boolean;
}

const FronsideCardBox = styled.div<FrontsideCardBoxProps>`
  ${playCardBaseStyles}
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
      ? css`
          cursor: pointer;
          transition: transform 0.3s;
          &:hover {
            transform: translate(0, -10px);
          }
        `
      : ""}
  ${({ isdisabled: isDisabled }) =>
    isDisabled
      ? css`
          background-color: #ffffff;
        `
      : ""}
  & span {
    border-bottom: 2px solid ${({ colorSet }) => colorSet.text};
  }
`;
