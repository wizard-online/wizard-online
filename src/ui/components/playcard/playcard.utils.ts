import { Card, Rank, Suit } from "../../../game/entities/cards";
import { ColorSet, cardColors } from "../../util/colors";

export function getColor({ rank, suit }: Card): ColorSet {
  if (rank === Rank.Z || rank === Rank.N) {
    return cardColors.zn;
  }
  switch (suit) {
    case Suit.Blue:
      return cardColors.blue;
    case Suit.Green:
      return cardColors.green;
    case Suit.Red:
      return cardColors.red;
    case Suit.Yellow:
      return cardColors.yellow;
    // fallback
    default:
      return cardColors.zn;
  }
}
