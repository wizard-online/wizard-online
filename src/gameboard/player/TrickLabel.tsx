import React from "react";
import { Box, Chip } from "@material-ui/core";
import styled from "styled-components";
import { PlayerProps } from "./Player.props";
import { useGameState } from "../GameContext";

export const TrickLabel: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { round },
  } = useGameState();

  const trickValue = round?.trickCount[playerID];
  const bidValue = round?.bids[playerID];

  return (
    <Box>
      <b>Stiche: </b>
      <Chip
        label={
          <>
            <TrickValue>{trickValue ?? "_"}</TrickValue>
            <Divider />
            <BidValue>{bidValue ?? "_"}</BidValue>
          </>
        }
        variant={bidValue !== null ? "outlined" : "default"}
      />
    </Box>
  );
};

const TrickValue = styled.span`
  display: inline-block;
  width: 12px;
  margin: 0 10px;
  font-size: 1.5em;
`;

const Divider = styled.span`
  font-size: 1.5em;
  margin: 0 10px;
  width: 0;
  border-right: 1px solid darkgrey;
`;

const BidValue = styled.span`
  display: inline-block;
  width: 10px;
`;
