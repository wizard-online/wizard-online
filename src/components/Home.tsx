import * as React from 'react';
import {FunctionComponent, ReactElement, Fragment} from 'react';

const Home: FunctionComponent<{}> = (): ReactElement => (
  <Fragment>
    <div>Welcome to the ultimate react starter</div>
    <ul>
      <li>React</li>
      <li>TypeScript</li>
      <li>Parcel</li>
      <li>React router</li>
      <li>EsLint</li>
    </ul>
  </Fragment>
);

export default Home;