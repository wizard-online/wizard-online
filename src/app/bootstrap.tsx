import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initializeGA } from "./analytics";

initializeGA();

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Root element #root not found");
const root = createRoot(rootElement);
root.render(<App />);
