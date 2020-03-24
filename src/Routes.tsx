import React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Contact } from "./components/Contact";

export const Routes: React.FC<{}> = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/contact" component={Contact} />
  </Switch>
);
