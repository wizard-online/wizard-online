import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CreateMatch } from "./CreateMatch";
import { MatchContainer } from "./MatchContainer";
import { ListMatches } from "./ListMatches";
import { pageview } from "../../analytics";
import { Profile } from "./Profile";
import { FinalScore } from "./FinalScore";

export const LobbyRouter: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    pageview(location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<CreateMatch />} />
      <Route path="/matches" element={<ListMatches />} />
      <Route path="/matches/:matchID" element={<MatchContainer />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/score/:sharableFinalScore" element={<FinalScore />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
