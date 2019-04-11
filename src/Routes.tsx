import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/contact" component={Contact} />
    </Switch>
  );
}

export default Routes;