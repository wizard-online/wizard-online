import React from "react";
import styled from "styled-components";
import { useTheme } from "@material-ui/core";
import { playCardBaseStyles } from "./playcard.styles";
import { cardColors } from "../../util/colors";

export const PlayCardBackside: React.FC = () => {
  const theme = useTheme();
  return (
    <BacksideContainer $color={theme.palette.primary.light}>
      Wizard
    </BacksideContainer>
  );
};

const BacksideContainer = styled.div<{ $color: string }>`
  ${playCardBaseStyles}
  font-size: 15px;
  font-style: italic;
  background: radial-gradient(
    circle,
    ${({ $color }) => $color} 0%,
    rgba(0, 0, 0, 1) 75%
  );
  color: ${cardColors.back.outline};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${cardColors.back.text};
  text-shadow: 0 0 8px ${cardColors.back.shadow};
`;
