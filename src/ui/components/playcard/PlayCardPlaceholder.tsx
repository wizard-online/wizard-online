import React from "react";
import styled from "styled-components";
import { playCardBaseStyles } from "./playcard.styles";

export const PlayCardPlaceholder: React.FC = ({ children }) => {
  return <PlaceholderContainer>{children}</PlaceholderContainer>;
};

const PlaceholderContainer = styled.div`
  ${playCardBaseStyles}
`;
