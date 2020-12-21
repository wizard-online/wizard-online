import ReactGA from "react-ga";
import { NumPlayers } from "../shared/entities/players";

export function initializeGA(): void {
  if (process.env.ANALYTICS_ID) {
    ReactGA.initialize(process.env.ANALYTICS_ID);
    pageview();
  }
}

export function pageview(location?: { pathname: string }): void {
  const pathname = location?.pathname ?? window.location.pathname;
  let analyticsPath = pathname;

  // remove matchID param from /matches/<matchID> URLs
  if (pathname.match(/matches\/[\w-]+/i)) {
    analyticsPath = "/matches/match-id";
  }
  ReactGA.pageview(analyticsPath);
}

export function finishedGameEventGA(numPlayers: NumPlayers): void {
  ReactGA.event({
    category: "Game",
    action: "Finished Game",
    value: numPlayers,
  });
}

export function createdGameEventGA(numPlayers: NumPlayers): void {
  ReactGA.event({
    category: "Game",
    action: "Created new game",
    value: numPlayers,
  });
}

export function copiedGameLinkEventGA(): void {
  ReactGA.event({
    category: "User",
    action: "Copied game link",
  });
}

export function copiedScoreLinkEventGA(): void {
  ReactGA.event({
    category: "User",
    action: "Copied game link",
  });
}

export function joinedGameEventGA(): void {
  ReactGA.event({
    category: "Game",
    action: "Joined Game",
  });
}

export function leftGameEventGA(): void {
  ReactGA.event({
    category: "Game",
    action: "Left Game",
  });
}

export function createdProfileEventGA(): void {
  ReactGA.event({
    category: "User",
    action: "Created new user profile",
  });
}

export function startedGameEventGA(): void {
  ReactGA.event({
    category: "Game",
    action: "Started Game",
  });
}
