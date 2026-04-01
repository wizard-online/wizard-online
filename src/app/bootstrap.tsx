import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initializeGA } from "./analytics";

initializeGA();

const root = createRoot(document.querySelector("#root")!);
root.render(<App />);
