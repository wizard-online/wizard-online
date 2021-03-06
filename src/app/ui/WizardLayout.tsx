import React from "react";
import styled from "styled-components";
import { PlayersContainer } from "./player/PlayersContainer";
import { FinalScoreModal } from "./gameover/FinalScoreModal";
import { Table } from "./table/Table";
import { useGameHeaderElements } from "./hooks/game-header-elements";
import { ScoreContainer } from "./score/ScoreContainer";

export const WizardLayout: React.FC = () => {
  useGameHeaderElements();
  return (
    <>
      <BoardContainer>
        <PlayersContainer upper />
        <Table />
        <PlayersContainer />
        <ScoreContainer />
      </BoardContainer>
      <FinalScoreModal />
    </>
  );
};

const BoardContainer = styled.div`
  min-width: 1000px;
  max-width: 1400px;
`;
