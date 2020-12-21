import React from "react";
import styled from "styled-components";
import { playCardBaseStyles } from "./playcard.styles";
import { colors } from "../../util/colors";

export const PlayCardPlaceholder: React.FC = ({ children }) => {
  return <PlaceholderContainer>{children}</PlaceholderContainer>;
};

const PlaceholderContainer = styled.div`
  ${playCardBaseStyles}
  background-color: ${colors.lightgrey};
  opacity: .6;
`;
