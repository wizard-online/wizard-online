import React from "react";
import styled, { keyframes, css } from "styled-components";
import { colors } from "../util/colors";

export interface BlinkerProps {
  on: boolean;
}

export const Blinker: React.FC<BlinkerProps> = ({ on }) => {
  return <BlinkContainer on={on} />;
};

const blinking = keyframes`
  0% {background-color: ${colors.blue.light}}
  25% {background-color: ${colors.green.light}}
  50% {background-color: ${colors.red.light}}
  75% {background-color: ${colors.yellow.light}}
`;

const BlinkContainer = styled.div<{ on: boolean }>`
  animation: ${({ on }) =>
    on
      ? css`
          ${blinking} 3s infinite
        `
      : `none`};
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid ${colors.grey};
  box-shadow: 0px 0px 2px ${colors.grey};
  display: inline-block;
  margin: 2px 10px;
`;
