import React from "react";
import { useParams } from "react-router-dom";
import { parse } from "../services/share-scorepad";
import { ScorePad } from "../score/ScorePad";

export const FinalScore: React.FC = () => {
  const { sharableFinalScore } = useParams<{ sharableFinalScore: string }>();
  const { date, playerNames, scorePad } = parse(sharableFinalScore);
  return (
    <div>
      <h2>{date}</h2>
      <ScorePad
        scorePad={scorePad}
        playerNames={playerNames}
        rounds={scorePad.map(({ numCards }) => numCards)}
      />
    </div>
  );
};
