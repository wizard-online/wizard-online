import { useTheme } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { colors } from "../util/colors";

interface TimeoutIndicatorBarProps {
  timeout: number;
  isActive: boolean;
}

export const TimeoutIndicatorBar: React.FC<TimeoutIndicatorBarProps> = ({
  timeout,
  isActive,
}) => {
  const theme = useTheme();

  const timeoutInSeconds = (timeout / 1000).toFixed(2);
  return (
    <Container>
      <Progress
        $isRunning={isActive}
        $timeout={timeoutInSeconds}
        $color={theme.palette.primary.main}
      />
    </Container>
  );
};

const Container = styled.div`
  background-color: ${colors.grey};
  height: 5px;
  /* width: 100%; */
`;

const Progress = styled.div<{
  $isRunning: boolean;
  $timeout: string;
  $color: string;
}>`
  background-color: ${({ $color }) => $color};
  height: 100%;
  ${({ $isRunning, $timeout }) =>
    $isRunning
      ? `
    width: 100%;
    transition: width ${$timeout}s linear;
  `
      : `
    width: 0%;
  `}
`;
