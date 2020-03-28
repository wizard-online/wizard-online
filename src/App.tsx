import React from "react";

import { WizardClient as GameClient } from "./Game";

export const App: React.FC<{}> = () => (
  <>
    <GameClient playerID="0" />
    <GameClient playerID="1" />
  </>
);
