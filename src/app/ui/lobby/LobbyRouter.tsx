import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { CreateMatch } from "./CreateMatch";
import { MatchContainer } from "./MatchContainer";
import { ListMatches } from "./ListMatches";
import { pageview } from "../../analytics";
import { Profile } from "./Profile";
import { FinalScore } from "./FinalScore";

export const LobbyRouter: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen(pageview);
    return () => unlisten();
  }, [history]);

  return (
    <Switch>
      <Route exact path="/">
        <CreateMatch />
      </Route>
      <Route exact path="/matches">
        <ListMatches />
      </Route>
      <Route path="/matches/:matchID">
        <MatchContainer />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/score/:sharableFinalScore">
        <FinalScore />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};
