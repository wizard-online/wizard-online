import React from "react";
import styled from "styled-components";
import { playCardBaseStyles } from "./playcard.styles";
import { cardColors } from "../../util/colors";

export const PlayCardBackside: React.FC = () => {
  return <BacksideContainer>Wizard</BacksideContainer>;
};

const BacksideContainer = styled.div`
  ${playCardBaseStyles}
  font-size: 15px;
  font-style: italic;
  background-color: ${cardColors.back.background};
  color: ${cardColors.back.outline};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${cardColors.back.text};
  -webkit-text-stroke: 1px ${cardColors.back.outline};
  text-shadow: 0 0 8px ${cardColors.back.shadow};
`;
