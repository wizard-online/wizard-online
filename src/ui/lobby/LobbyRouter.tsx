import React, { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { CreateGame } from "./CreateGame";
import { GameContainer } from "./GameContainer";
import { ListGames } from "./ListGames";
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
        <CreateGame />
      </Route>
      <Route exact path="/games">
        <ListGames />
      </Route>
      <Route path="/games/:gameID">
        <GameContainer />
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
