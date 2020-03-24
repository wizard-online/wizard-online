import React from "react";
import { Link } from "react-router-dom";

export const Nav: React.FC<{}> = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
    </ul>
  </nav>
);
