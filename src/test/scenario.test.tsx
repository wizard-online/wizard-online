import React from "react";
import { render } from "@testing-library/react";

import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";

import { wizardGameConfig } from "../game/game";
import { WizardBoard } from "../ui/WizardBoard";

const WizardClient = Client({
  game: wizardGameConfig,
  board: WizardBoard,
  numPlayers: 4,
  multiplayer: Local(),
});

test("setup", () => {
  const { getByTestId } = render(
    <div data-testid="test-root">
      {[0, 1, 2, 3].map((id) => (
        <div data-testid={`player${id}`}>
          <WizardClient playerID={id.toString()} />
        </div>
      ))}
    </div>
  );

  expect(getByTestId("player0")).toBeDefined();
  expect(getByTestId("player1")).toBeDefined();
  expect(getByTestId("player2")).toBeDefined();
  expect(getByTestId("player3")).toBeDefined();
});
