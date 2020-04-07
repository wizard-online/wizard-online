/* eslint-disable jest/expect-expect */
import React from "react";
import {
  render,
  RenderResult,
  prettyDOM,
  getByText,
  queryByText,
  fireEvent,
  getByLabelText,
  getByRole,
  getByTestId,
  queryByLabelText,
  queryByTestId,
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

function bidSelectMove(playerID: PlayerID, bid: number): void {
  const bidSlider = getByLabelText(clients[playerID], /stiche ansagen/i);
  bidSlider.focus();
  // reset slider value
  fireEvent.keyDown(document.activeElement!, { key: "Home" });
  // press right arrow key {bid} times
  range(0, bid).forEach(() => {
    fireEvent.keyDown(document.activeElement!, { key: "ArrowRight" });
  });
}

function bidSubmitMove(playerID: PlayerID): void {
  const bidSubmitButton = getByText(clients[playerID], /ansagen/i);
  fireEvent.click(bidSubmitButton);
}

function bidMove(playerID: PlayerID, bid: number, numPlayers: number): void {
  testIsTurn(playerID, numPlayers);
  bidSelectMove(playerID, bid);
  testBidSelect(playerID, bid);
  bidSubmitMove(playerID);
}

function playMove(playerID: PlayerID, card: Card): void {
  const cardButton = getByLabelText(clients[playerID], getCardLabel(card));
  expect(cardButton).toBeInTheDocument();
  fireEvent.click(cardButton);
  // test card removed from hand
  const clientHand = getByTestId(clients[playerID], "client-hand");
  expect(
    queryByLabelText(clientHand, getCardLabel(card))
  ).not.toBeInTheDocument();
  // test card added on table
  const tablePlay = getByTestId(clients[playerID], "table-play");
  expect(queryByLabelText(tablePlay, getCardLabel(card))).toBeInTheDocument();
}

interface RoundScenario {
  numPlayers: NumPlayers;
  numCards: number;
  moves: {
    [playerID: number]: PlayerMoves;
  };
  dealer: PlayerID;
  trumpCard: Card;
  trumpSuit?: Suit;
}

interface PlayerMoves {
  bid: number;
  play: Card[];
}

function initScenarioDeck({
  numPlayers,
  numCards,
  dealer,
  moves,
  trumpCard,
}: RoundScenario): Card[] {
  const deck: Card[] = [];
  deck.push(trumpCard);
  range(0, numCards).forEach((cardIndex) => {
    range(0, numPlayers)
      .map((x) => (dealer + x + 1) % numPlayers)
      .reverse()
      .forEach((playerID) => {
        deck.push(moves[playerID].play[cardIndex]);
      });
  });
  return deck;
}

function testIsTurn(playerID: PlayerID, numPlayers: number): void {
  range(0, numPlayers)
    .filter((pID) => pID !== playerID)
    .forEach((pID) => {
      expect(
        queryByText(clients[pID], /du bist am zug/i)
      ).not.toBeInTheDocument();
    });
  expect(queryByText(clients[playerID], /du bist am zug/i)).toBeInTheDocument();
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

function testCorrectHandout({ moves }: RoundScenario): void {
  Object.entries(moves).forEach(([playerID, playerMoves]) => {
    playerMoves.play.forEach((card) => {
      expect(
        getByLabelText(
          clients[Number.parseInt(playerID, 10)],
          getCardLabel(card)
        )
      ).toBeInTheDocument();
    });
  });
}

function testBidSelect(playerID: PlayerID, bid: number): void {
  const bidSlider = getByLabelText(clients[playerID], /stiche ansagen/i);
  expect(bidSlider.getAttribute("aria-valuenow")).toBe(bid.toString());
}

function getTurnOrder(leader: PlayerID, numPlayers: number): PlayerID[] {
  return range(0, numPlayers).map(
    (id) => (id + leader) % numPlayers
  ) as PlayerID[];
}

function nextPlayer(currentPlayer: PlayerID, numPlayers: number): PlayerID {
  return ((currentPlayer + 1) % numPlayers) as PlayerID;
}

function doRound(
  leader: PlayerID,
  numPlayers: number,
  action: (playerID: PlayerID) => void
): void {
  getTurnOrder(leader, numPlayers).forEach(action);
}

test("4 four players game", () => {
  // Round 1
  const round1Scenario: RoundScenario = {
    numPlayers: 4,
    numCards: 1,
    dealer: 2,
    moves: {
      0: { bid: 1, play: [Card(Suit.Red, 7)] },
      1: { bid: 0, play: [Card(Suit.Blue, 3)] },
      2: { bid: 0, play: [Card(Suit.Red, 9)] },
      3: { bid: 1, play: [Card(Suit.Green, 11)] },
    },
    trumpCard: Card(Suit.Blue, 4),
  };
  const { numPlayers } = round1Scenario;
  let currentPlayer: PlayerID = round1Scenario.dealer;
  // player 2 ist dealer
  testDealer(round1Scenario);

  const deck = initScenarioDeck(round1Scenario);
  shuffleMock.mockReturnValue(deck);

  // shuffle deck
  shuffleMove(currentPlayer);

  // handout
  handoutMove(currentPlayer);
  currentPlayer = nextPlayer(currentPlayer, numPlayers);
  testCorrectHandout(round1Scenario);

  // do bidding round
  doRound(currentPlayer, numPlayers, (playerID) => {
    const { bid } = round1Scenario.moves[playerID];
    bidMove(playerID, bid, numPlayers);
  });
  testIsTurn(3, round1Scenario.numPlayers);

  // do playing
  doRound(currentPlayer, numPlayers, (playerID) =>
    playMove(playerID, round1Scenario.moves[playerID].play[0])
  );
  testIsTurn(3, round1Scenario.numPlayers);
});
