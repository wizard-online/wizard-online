import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { parse } from "../services/share-scorepad";
import { ScorePad } from "../score/ScorePad";
import { getLeaders } from "../../game/entities/score.utils";

const deDateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
};
const deDateTimeFormat = new Intl.DateTimeFormat(
  "de-DE",
  deDateTimeFormatOptions
);

export const FinalScore: React.FC = () => {
  const { sharableFinalScore } = useParams<{ sharableFinalScore: string }>();

  try {
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
        <h5>{deDateTimeFormat.format(date)}</h5>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h3>Fehlerhafter Link.</h3>
        <Button component={Link} to="/">
          Zur Startseite
        </Button>
      </div>
    );
  }
};
