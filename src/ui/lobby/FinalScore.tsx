import React from "react";
import { useParams } from "react-router-dom";
import { parse } from "../services/share-scorepad";
import { ScorePad } from "../score/ScorePad";
import { getLeaders } from "../../game/entities/score.utils";

export const FinalScore: React.FC = () => {
  const { sharableFinalScore } = useParams<{ sharableFinalScore: string }>();
  const { date, playerNames, scorePad } = parse(sharableFinalScore);

  const winners = getLeaders(scorePad);
  const winnersNames = winners.map((playerID) => playerNames[playerID]);
  return (
    <div>
      <h1>
        {winnersNames.join("&")}{" "}
        {winnersNames.length > 1 ? "gewinnen" : "gewinnt"}!
      </h1>
      <ScorePad
        scorePad={scorePad}
        playerNames={playerNames}
        rounds={scorePad.map(({ numCards }) => numCards)}
      />
      <h5>{date.toDateString()}</h5>
    </div>
  );
};
