import React from "react";

import { HashRouter as Router } from "react-router-dom";
import { Routes } from "./Routes";
import { Nav } from "./components/Nav";

export const App: React.FC<{}> = () => (
  <Router>
    <>
      <h1>TEST TITLE</h1>
      <Nav />
      <Routes />
    </>
  </Router>
);
