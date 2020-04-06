/* eslint-disable jest/expect-expect */
import React from "react";
import {
  render,
  RenderResult,
  prettyDOM,
  getByText,
  queryByText,
  act,
  fireEvent,
  getByLabelText,
} from "@testing-library/react";

import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";

import random from "lodash/random";
import shuffle from "lodash/shuffle";

import range from "lodash/range";
import { wizardGameConfig } from "../game/game";
import { WizardBoard } from "../ui/WizardBoard";
import { Suit, Card } from "../game/entities/cards";
import { getCardLabel } from "../game/entities/cards.utils";
import { PlayerID, NumPlayers } from "../game/entities/players";

jest.mock("lodash/random");
jest.mock("lodash/shuffle");
const randomMock = random as jest.Mock;
const shuffleMock = shuffle as jest.Mock;

const WizardClient = Client({
  game: wizardGameConfig,
  board: WizardBoard,
  numPlayers: 4,
  multiplayer: Local(),
  debug: false,
});

let renderResult: RenderResult;
let clients: HTMLElement[];
beforeAll(() => {
  // mock initial dealer selection
  randomMock.mockReturnValueOnce(2);
  shuffleMock.mockReturnValueOnce([]);

  const ids = [0, 1, 2, 3];

  renderResult = render(
    <div data-testid="test-root">
      {ids.map((id) => (
        <div data-testid={`player${id}`} key={id}>
          <WizardClient playerID={id.toString()} />
        </div>
      ))}
    </div>
  );

  clients = ids.map((id) => renderResult.getByTestId(`player${id}`));
});

function shuffleMove(playerID: PlayerID): void {
  const shuffleButton = getByText(clients[playerID], /mischen/i);
  expect(shuffleButton).toBeInTheDocument();
  fireEvent.click(shuffleButton);
}

function handoutMove(playerID: PlayerID): void {
  const handoutButton = getByText(clients[playerID], /austeilen/i);
  expect(handoutButton).toBeInTheDocument();
  fireEvent.click(handoutButton);
}

function playMove(playerID: PlayerID, card: Card): void {
  const cardButton = getByLabelText(clients[playerID], getCardLabel(card));
  expect(cardButton).toBeInTheDocument();
  fireEvent.click(cardButton);
}

interface RoundScenario {
  numPlayers: NumPlayers;
  numCards: number;
  hands: {
    [playerID: number]: Card[];
  };
  dealer: PlayerID;
  trumpCard: Card;
  trumpSuit?: Suit;
}

function initScenarioDeck({
  numPlayers,
  numCards,
  dealer,
  hands,
  trumpCard,
}: RoundScenario): Card[] {
  const deck: Card[] = [];
  deck.push(trumpCard);
  range(0, numCards).forEach((cardIndex) => {
    range(0, numPlayers)
      .map((x) => (dealer + x + 1) % numPlayers)
      .reverse()
      .forEach((playerID) => {
        deck.push(hands[playerID][cardIndex]);
      });
  });
  return deck;
}

function testDealer({ dealer, numPlayers }: RoundScenario): void {
  range(0, numPlayers)
    .filter((playerID) => playerID !== dealer)
    .forEach((playerID) => {
      expect(
        queryByText(clients[playerID], /du bist am zug/i)
      ).not.toBeInTheDocument();
    });
  expect(queryByText(clients[dealer], /du bist am zug/i)).toBeInTheDocument();
}

function testCorrectHandout({ hands }: RoundScenario): void {
  Object.entries(hands).forEach(([playerID, hand]) => {
    hand.forEach((card) => {
      expect(
        getByLabelText(
          clients[Number.parseInt(playerID, 10)],
          getCardLabel(card)
        )
      ).toBeInTheDocument();
    });
  });
}

test("4 four players game", () => {
  // Round 1

  const round1Scenario: RoundScenario = {
    numPlayers: 4,
    numCards: 1,
    dealer: 2,
    hands: {
      0: [Card(Suit.Red, 7)],
      1: [Card(Suit.Blue, 3)],
      2: [Card(Suit.Red, 9)],
      3: [Card(Suit.Green, 11)],
    },
    trumpCard: Card(Suit.Blue, 4),
  };
  // player 2 ist dealer
  act(() => {
    // expect(queryByText(clients[2], /du bist am zug/i)).toBeInTheDocument();
    // expect(queryByText(clients[0], /du bist am zug/i)).not.toBeInTheDocument();
    // expect(queryByText(clients[1], /du bist am zug/i)).not.toBeInTheDocument();
    // expect(queryByText(clients[3], /du bist am zug/i)).not.toBeInTheDocument();
    testDealer(round1Scenario);

    const deck = initScenarioDeck(round1Scenario);
    shuffleMock.mockReturnValue(deck);

    // shuffle deck
    shuffleMove(round1Scenario.dealer);
  });
  act(() => {
    // handout
    handoutMove(round1Scenario.dealer);
  });
  act(() => {
    testCorrectHandout(round1Scenario);
    playMove(3, round1Scenario.hands[3][0]);
    // expect(
    //   getByLabelText(clients[3], getCardLabel(round1Scenario.hands[3][0]))
    // ).not.toBeInTheDocument();
  });
});

// test("initial dealer", () => {
//   const a = getByText(clients[2], /du bist am zug/i);
//   console.log(prettyDOM(document.body));

//   expect(getByText(clients[2], /du bist am zug/i)).toBeInTheDocument();
//   expect(queryByText(clients[0], /du bist am zug/i)).not.toBeInTheDocument();
//   expect(queryByText(clients[1], /du bist am zug/i)).not.toBeInTheDocument();
//   expect(queryByText(clients[3], /du bist am zug/i)).not.toBeInTheDocument();
// });
// describe("round 1", () => {
//   // TODO: make dealer selection deterministic
//   // TODO: make deck shuffle deterministic
//   test("dealer", () => {

//   });
// });
