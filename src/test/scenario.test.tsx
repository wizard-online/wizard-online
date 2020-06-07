/* eslint-disable no-console */
/* eslint-disable jest/expect-expect */
import React from "react";
// import from "@testing-library/react/pure" to prevent automatic dom cleanup after each test
// https://github.com/testing-library/testing-library-docs/blob/master/docs/react-testing-library/setup.md#skipping-auto-cleanup
import {
  render,
  RenderResult,
  getByText,
  queryByText,
  fireEvent,
  getByLabelText,
  getByTestId,
  queryByTestId,
  queryAllByTestId,
} from "@testing-library/react/pure";

import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";

import random from "lodash/random";
import shuffle from "lodash/shuffle";

import range from "lodash/range";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { wizardGameConfig } from "../game/game";
import { WizardBoard } from "../ui/WizardBoard";
import { Suit, Card } from "../game/entities/cards";
import { getSuitLabel, getCardId } from "../game/entities/cards.utils";
import { PlayerID } from "../game/entities/players";
import { scenario, RoundScenario } from "./scenario.data";
import { theme } from "../ui/util/mui-theme";
import { NotificationsProvider } from "../ui/NotificationsProvider";
import { ProfileProvider } from "../ui/ProfileProvider";
import { HeaderElementsProvider } from "../ui/header/HeaderElementsProvider";
import { finishedGameEventGA } from "../analytics";

jest.mock("lodash/random");
jest.mock("lodash/shuffle");
const randomMock = random as jest.Mock;
const shuffleMock = shuffle as jest.Mock;

jest.mock("../analytics");
jest.mock("react-ga");

const WizardClient = Client({
  game: wizardGameConfig,
  board: WizardBoard,
  numPlayers: 4,
  // @ts-ignore  - TODO: remove ts-igore as soon as boardgame.io types are fixed
  multiplayer: Local(),
  debug: false,
});

let renderResult: RenderResult;
let clients: HTMLElement[];
beforeAll(() => {
  // mock initial dealer selection
  randomMock.mockReturnValue(scenario.firstDealer);
  shuffleMock.mockReturnValue([]);
  // mock localStorage
  localStorage.setItem(
    "wizard-profile",
    JSON.stringify({ name: "test-player", preferences: {} })
  );

  const ids = [0, 1, 2, 3];

  renderResult = render(
    <div data-testid="test-root">
      <ThemeProvider theme={theme}>
        {ids.map((id) => (
          <div data-testid={`player${id}`} key={id}>
            <NotificationsProvider>
              <ProfileProvider>
                <HeaderElementsProvider>
                  <BrowserRouter>
                    <WizardClient playerID={id.toString()} />
                  </BrowserRouter>
                </HeaderElementsProvider>
              </ProfileProvider>
            </NotificationsProvider>
          </div>
        ))}
      </ThemeProvider>
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

function selectTrumpMove(playerID: PlayerID, trumpSuit: Suit): void {
  const trumpLabel = getSuitLabel(trumpSuit);
  const suitSelect = getByText(clients[playerID], trumpLabel);
  fireEvent.click(suitSelect);
  const submitSuitButton = getByText(clients[playerID], /trumpf wählen/i);
  fireEvent.click(submitSuitButton);
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
  const cardTestId = getCardId(card);
  const cardButton = getByTestId(clients[playerID], cardTestId);
  expect(cardButton).toBeInTheDocument();
  fireEvent.click(cardButton);
  // test card removed from hand
  const clientHand = getByTestId(clients[playerID], "client-hand");
  expect(queryByTestId(clientHand, cardTestId)).not.toBeInTheDocument();
  // test card added on table
  const tablePlay = getByTestId(clients[playerID], "table-play");
  expect(getByTestId(tablePlay, cardTestId)).toBeInTheDocument();
  expect(queryByTestId(clientHand, cardTestId)).not.toBeInTheDocument();
}

function initScenarioDeck(
  numPlayers: number,
  dealer: PlayerID,
  { numCards, moves, trumpCard }: RoundScenario
): Card[] {
  const deck: Card[] = [];
  if (trumpCard) {
    deck.push(trumpCard);
  }
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
      try {
        expect(
          queryByText(clients[pID], /du bist am zug/i)
        ).not.toBeInTheDocument();
      } catch (error) {
        console.log(
          `expected to be the turn of player ${playerID}, but found player ${pID}`
        );
        throw new Error(error);
      }
    });
  expect(queryByText(clients[playerID], /du bist am zug/i)).toBeInTheDocument();
}

function testCorrectHandout({ moves }: RoundScenario): void {
  Object.entries(moves).forEach(([playerID, playerMoves]) => {
    playerMoves.play.forEach((card) => {
      try {
        expect(
          queryByTestId(clients[Number.parseInt(playerID, 10)], getCardId(card))
        ).toBeInTheDocument();
      } catch (error) {
        // console.log(
        //   prettyDOM(
        //     clients[Number.parseInt(playerID, 10)].querySelector(
        //       '[data-testid="client-hand"]'
        //     ) ?? undefined
        //   )
        // );
        throw new Error(error);
      }
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

const { numPlayers, firstDealer, rounds } = scenario;
let descriptionPlayer: PlayerID = firstDealer;
let currentDealer: PlayerID;
let currentPlayer: PlayerID;

rounds.forEach((round) => {
  const { numCards, moves, trumpSuit, trickWinners } = round;
  describe(`Round ${numCards}`, () => {
    test(`player ${descriptionPlayer} is dealer`, () => {
      if (currentDealer >= 0) {
        currentDealer = nextPlayer(currentDealer, numPlayers);
      } else {
        currentDealer = firstDealer;
      }
      currentPlayer = currentDealer;
      // player 0 ist dealer
      testIsTurn(currentDealer, numPlayers);
    });
    test("handout", () => {
      const deck = initScenarioDeck(numPlayers, currentDealer, round);
      shuffleMock.mockReturnValue(deck);
      // shuffle deck
      shuffleMove(currentPlayer);

      // handout
      handoutMove(currentPlayer);
      testCorrectHandout(round);
    });
    if (trumpSuit) {
      test("select trump", () => {
        selectTrumpMove(currentPlayer, trumpSuit);
      });
    }
    // go to next player after dealer
    descriptionPlayer = nextPlayer(descriptionPlayer, numPlayers);
    test(`player ${descriptionPlayer} is at first bidding turn`, () => {
      currentPlayer = nextPlayer(currentPlayer, numPlayers);
      testIsTurn(currentPlayer, numPlayers);
    });
    test("bidding", () => {
      // do bidding round
      doRound(currentPlayer, numPlayers, (playerID) => {
        const { bid } = moves[playerID];
        bidMove(playerID, bid, numPlayers);
      });
      testIsTurn(currentPlayer, numPlayers);
    });
    range(0, numCards).forEach((cardIndex) => {
      test(`playing card ${cardIndex}`, () => {
        testIsTurn(currentPlayer, numPlayers);
        // do playing
        doRound(currentPlayer, numPlayers, (playerID) => {
          playMove(playerID, moves[playerID].play[cardIndex]);
        });
        currentPlayer = trickWinners[cardIndex];
      });
    });
    if (numCards * numPlayers < 60) {
      test("final score modal is not shown during game", () => {
        range(0, numPlayers).forEach((playerID) => {
          expect(
            queryByTestId(clients[playerID], "final-score")
          ).not.toBeInTheDocument();
        });
      });

      test("game over report is not send during game", () => {
        expect(finishedGameEventGA).not.toHaveBeenCalled();
      });
    } else {
      test("final score modal is shown after game", () => {
        const finalScoreModals = queryAllByTestId(document.body, "final-score");
        expect(finalScoreModals).toHaveLength(numPlayers);
        finalScoreModals.forEach((modal) => {
          expect(modal).toBeInTheDocument();
        });
      });

      test("game over reported to analytics", () => {
        expect(finishedGameEventGA).toHaveBeenLastCalledWith(numPlayers);
      });
    }
  });
});
