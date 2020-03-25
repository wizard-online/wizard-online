import flattenDeep from "lodash/flattenDeep";

export enum CardColor {
  Blue = "BLUE",
  Red = "RED",
  Yellow = "YELLOW",
  Green = "GREEN",
  Z = "Z",
  N = "N",
}

export enum CardValue {
  Null = 0,
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Eleven,
  Twelve,
  Thirteen,
}

export interface Card {
  color: CardColor;
  value: CardValue;
}

export function generateCardDeck(): Card[] {
  const config = [
    {
      colors: [
        CardColor.Blue,
        CardColor.Red,
        CardColor.Yellow,
        CardColor.Green,
      ],
      values: [
        CardValue.One,
        CardValue.Two,
        CardValue.Three,
        CardValue.Four,
        CardValue.Five,
        CardValue.Six,
        CardValue.Seven,
        CardValue.Eight,
        CardValue.Nine,
        CardValue.Ten,
        CardValue.Eleven,
        CardValue.Twelve,
        CardValue.Thirteen,
      ],
      times: 1,
    },
    {
      colors: [CardColor.Z, CardColor.N],
      values: [CardValue.Null],
      times: 4,
    },
  ];

  const cards = flattenDeep(
    config.map(({ colors, values, times }) => {
      const cardsByColor = colors.map((color) => {
        const cardsByValue = values.map((value) => {
          return Array<Card>(times).fill({ color, value });
        });
        return cardsByValue;
      });
      return cardsByColor;
    })
  );

  return cards;
}
