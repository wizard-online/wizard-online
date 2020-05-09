import URLSafeBase64 from "urlsafe-base64";
import flow from "lodash/fp/flow";
import { ScorePad, ScoreRow } from "../../game/entities/score";

export interface FinalResult {
  date: Date;
  playerNames: PlayerNames;
  scorePad: ScorePad;
}

export type SharableFinalResult = [Timestamp, PlayerNames, SharableScorePad];
export type Timestamp = number;
export type PlayerNames = string[];
export type SharableScorePad = SharableScoreRow[];
export type SharableScoreRow = [number, SharableScore[]];
export type SharableScore = [number, number];

export function fromScorePad(scorePad: ScorePad): SharableScorePad {
  return scorePad.map(({ numCards, playerScores }) => [
    numCards,
    playerScores.map(({ bid, tricks }) => [bid, tricks]),
  ]);
}

export function toScorepad(sharableScorepad: SharableScorePad): ScorePad {
  return sharableScorepad.reduce((scorePad, [numCards, scores]) => {
    const previousScoreRow = scorePad[scorePad.length - 1];
    const scoreRow: ScoreRow = {
      numCards,
      playerScores: scores.map(([bid, tricks], playerID) => {
        const score =
          bid === tricks ? 20 + bid * 10 : Math.abs(bid - tricks) * -10;
        return {
          bid,
          tricks,
          score,
          total: (previousScoreRow?.playerScores[playerID].total ?? 0) + score,
        };
      }),
    };
    return [...scorePad, scoreRow];
  }, [] as ScorePad);
}

export function sharableResultFromScorePad({
  date,
  playerNames,
  scorePad,
}: FinalResult): SharableFinalResult {
  return [date.getTime(), playerNames, fromScorePad(scorePad)];
}

export function sharableResultToScorePad([
  timestamp,
  playerNames,
  sharableScorePad,
]: SharableFinalResult): FinalResult {
  return {
    date: new Date(timestamp),
    playerNames,
    scorePad: toScorepad(sharableScorePad),
  };
}

export function stringify(finalResult: FinalResult): string {
  return flow(
    sharableResultFromScorePad,
    JSON.stringify,
    (jsonString) => Buffer.from(jsonString, "utf-8"),
    URLSafeBase64.encode
  )(finalResult);
}

export function parse(encodedString: string): FinalResult {
  return flow(
    URLSafeBase64.decode,
    (buffer) => buffer.toString(),
    JSON.parse,
    sharableResultToScorePad
  )(encodedString);
}
