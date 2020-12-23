import React from "react";
import ReactDOM from "react-dom";

import { useProfile } from "../ProfileProvider";

export const HeaderProfile: React.FC = () => {
  const { name } = useProfile();
  const portalNode = document.querySelector("#header-profile");
  return portalNode
    ? ReactDOM.createPortal(<div>Hallo {name}!</div>, portalNode)
    : null;
};
