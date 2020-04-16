import React from "react";
import styled from "styled-components";
import { colors } from "../util/colors";

export interface TrickCardProps {
  player: string;
}

export const TrickCardBox: React.FC<TrickCardProps> = ({
  player,
  children,
}) => {
  return (
    <Container>
      {children}
      <Spacer />
      <PlayerBox>{player}</PlayerBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  max-width: 150px;
  margin: 0 5px;
  padding: 8px 10px;
  background-color: ${colors.lightTransparentGrey};
  border-radius: 7px;
`;

const Spacer = styled.div`
  margin: 3px 0;
`;

const PlayerBox = styled.div`
  min-width: 70px;
  max-width: 100%;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
