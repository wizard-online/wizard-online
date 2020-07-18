import React from "react";
import styled, { css } from "styled-components";
import { Badge } from "@material-ui/core";

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
  preselected?: boolean;
}

export const PlayCardFrontside: React.FC<PlayCardFrontsideProps> = ({
  card,
  interactive = true,
  disabled = false,
  onClick = () => {},
  preselected = false,
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
      isPreselected={preselected}
      aria-label={getCardLabel(card)}
      data-testid={getCardId(card)}
    >
      <Badge invisible={!preselected} color="primary" variant="dot">
        <FrontSideCardContent isdisabled={disabled} colorSet={colorSet}>
          <span>{label}</span>
        </FrontSideCardContent>
      </Badge>
    </FronsideCardBox>
  );
};

interface FrontsideCardBoxProps {
  isplayable: boolean;
  isdisabled: boolean;
  isPreselected: boolean;
}

const FronsideCardBox = styled.div<FrontsideCardBoxProps>`
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
  ${({ isPreselected }) =>
    isPreselected
      ? css`
          transform: translate(0, -10px);
        `
      : ""}
`;

interface FrontSideCardContentProps {
  colorSet: ColorSet;
  isdisabled: boolean;
}

const FrontSideCardContent = styled.div<FrontSideCardContentProps>`
  ${playCardBaseStyles}
  font-size: 36px;
  font-weight: bold;
  /* colors */
  background: ${({ colorSet }) => colorSet.background};
  color: ${({ colorSet }) => colorSet.outline};
  /* cool outline effect only supported with prefix */
  -webkit-text-fill-color: ${({ colorSet }) => colorSet.text};
  -webkit-text-stroke: 2px ${({ colorSet }) => colorSet.outline};
  & span {
    border-bottom: 2px solid ${({ colorSet }) => colorSet.text};
  }
  ${({ isdisabled: isDisabled }) =>
    isDisabled
      ? css`
          background-color: #ffffff;
        `
      : ""}
`;
