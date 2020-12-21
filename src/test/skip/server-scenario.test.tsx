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
import { SocketIO } from "boardgame.io/multiplayer";

import range from "lodash/range";
import { Server } from "boardgame.io/server";
import { Ctx } from "boardgame.io";
import { wizardGameConfig } from "../../shared/game";
import { WizardBoard } from "../../app/ui/WizardBoard";
import { PlayerID } from "../../shared/entities/players";
import { scenario, RoundScenario } from "../scenario.data";
import { Card, Suit } from "../../shared/entities/cards";
import { getCardId, getSuitLabel } from "../../shared/entities/cards.utils";
import { generateDefaultWizardState } from "../../shared/WizardState";

const randomMock = jest.fn();
const shuffleMock = jest.fn();

const serverScenarioGameConfig = {
  ...wizardGameConfig,
  setup(ctx: Ctx) {
    return {
      ...generateDefaultWizardState(ctx),
      numCards: 14,
    };
  },
  plugins: [
    {
      name: "random",
      api: () => ({
        Die: randomMock,
        Shuffle: shuffleMock,
        _obj: {
          getState: () => {},
          isUsed: () => false,
        },
      }),
    },
  ],
};

const WizardClient = Client({
  game: serverScenarioGameConfig,
  board: WizardBoard,
  numPlayers: 4,
  multiplayer: SocketIO({ server: "localhost:8000" }),
  debug: false,
});

const server = Server({
  games: [serverScenarioGameConfig],
});

let runningServer: unknown;

beforeAll(async () => {
  runningServer = await server.run(8000, () =>
    console.log("server running on 8000")
  );
});

afterAll(() => {
  server.kill(runningServer);
});

let renderResult: RenderResult;
let clients: HTMLElement[];
beforeAll(() => {
  // mock initial dealer selection
  randomMock.mockReturnValue(3);
  shuffleMock.mockReturnValue([]);

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

async function bidMove(
  playerID: PlayerID,
  bid: number,
  numPlayers: number
): Promise<void> {
  await sleep();

  testIsTurn(playerID, numPlayers);
  bidSelectMove(playerID, bid);
  await sleep();

  testBidSelect(playerID, bid);
  bidSubmitMove(playerID);
}

async function playMove(playerID: PlayerID, card: Card): Promise<void> {
  await sleep();
  const cardTestId = getCardId(card);
  const cardButton = getByTestId(clients[playerID], cardTestId);
  expect(cardButton).toBeInTheDocument();
  fireEvent.click(cardButton);
  await sleep();

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

async function sleep(ms = 500): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

const { numPlayers, rounds } = scenario;
let descriptionPlayer: PlayerID = 3;
let currentDealer: PlayerID;
let currentPlayer: PlayerID;

test("setup", async () => {
  await sleep(2000);

  range(0, numPlayers).forEach((playerID) => {
    expect(
      queryByText(clients[playerID], /connecting/i)
    ).not.toBeInTheDocument();
  });
});

rounds.slice(-2).forEach((round) => {
  const { numCards, moves, trumpSuit, trickWinners } = round;
  describe(`Round ${numCards}`, () => {
    test(`player ${descriptionPlayer} is dealer`, async () => {
      if (currentDealer >= 0) {
        currentDealer = nextPlayer(currentDealer, numPlayers);
      } else {
        currentDealer = 3;
      }
      currentPlayer = currentDealer;

      await sleep();

      // player 0 ist dealer
      testIsTurn(currentDealer, numPlayers);
    });
    test("handout", async () => {
      const deck = initScenarioDeck(numPlayers, currentDealer, round);
      shuffleMock.mockReturnValue(deck);
      // shuffle deck
      shuffleMove(currentPlayer);

      await sleep();

      // handout
      handoutMove(currentPlayer);

      await sleep();

      testCorrectHandout(round);
    });
    if (trumpSuit) {
      test("select trump", async () => {
        await sleep();
        selectTrumpMove(currentPlayer, trumpSuit);
      });
    }
    // go to next player after dealer
    descriptionPlayer = nextPlayer(descriptionPlayer, numPlayers);
    test(`player ${descriptionPlayer} is at first bidding turn`, async () => {
      currentPlayer = nextPlayer(currentPlayer, numPlayers);
      await sleep();

      testIsTurn(currentPlayer, numPlayers);
    });
    // bidding
    getTurnOrder(descriptionPlayer, numPlayers).forEach(
      (descriptionPlayerID) => {
        test(`bidding player ${descriptionPlayerID}`, async () => {
          testIsTurn(currentPlayer, numPlayers);
          const { bid } = moves[currentPlayer];
          await bidMove(currentPlayer, bid, numPlayers);
          await sleep();
          currentPlayer = nextPlayer(currentPlayer, numPlayers);
        });
      }
    );
    // playing

    range(0, numCards).forEach((cardIndex) => {
      getTurnOrder(descriptionPlayer, numPlayers).forEach(
        (descriptionPlayerID, index) => {
          test(`playing card ${cardIndex} player ${descriptionPlayerID}`, async () => {
            testIsTurn(currentPlayer, numPlayers);
            await playMove(currentPlayer, moves[currentPlayer].play[cardIndex]);
            await sleep();
            if (index + 1 < numPlayers) {
              currentPlayer = nextPlayer(currentPlayer, numPlayers);
            } else {
              currentPlayer = trickWinners[cardIndex];
            }
          });
        }
      );
    });

    if (numCards * numPlayers < 60) {
      test("final score modal is not shown during game", () => {
        range(0, numPlayers).forEach((playerID) => {
          expect(
            queryByTestId(clients[playerID], "final-score")
          ).not.toBeInTheDocument();
        });
      });
    } else {
      test("final score modal is shown after game", () => {
        const finalScoreModals = queryAllByTestId(document.body, "final-score");
        expect(finalScoreModals).toHaveLength(numPlayers);
        finalScoreModals.forEach((modal) => {
          expect(modal).toBeInTheDocument();
        });
      });
    }
  });
});
