import React from "react";
import styled from "styled-components";
import { Trick } from "./Trick";
import { Deck } from "./Deck";
import { colors } from "../util/colors";

export const Table: React.FC = () => {
  return (
    <TableContainer>
      <Deck />
      <Trick />
    </TableContainer>
  );
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.wood.medium};
  border: 3px solid ${colors.wood.light};
  border-radius: 15px;
  min-height: 150px;
  margin: 25px 0;
  padding: 25px;
`;
