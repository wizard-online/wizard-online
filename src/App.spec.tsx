import React from "react";
import { render, cleanup } from "@testing-library/react";
import { App } from "./App";

afterEach(cleanup);

test("test h1", () => {
  const { getByText } = render(<App />);

  expect(getByText("TEST TITLE")).toBeDefined();
});
