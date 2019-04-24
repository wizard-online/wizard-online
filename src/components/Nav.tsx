
import * as React from 'react';
import {FunctionComponent, ReactElement} from 'react';
import {Link} from 'react-router-dom';

const Nav: FunctionComponent<{}> = (): ReactElement => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/contact">Contact</Link></li>
    </ul>
  </nav>
);

export default Nav;

