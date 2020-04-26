import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { initializeGA } from "./analytics";

initializeGA();

ReactDOM.render(<App />, document.querySelector("#root"));
