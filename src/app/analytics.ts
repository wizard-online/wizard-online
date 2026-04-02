import ReactGA from "react-ga4";
import { NumPlayers } from "../shared/entities/players";

export function initializeGA(): void {
  if (process.env.ANALYTICS_ID) {
    ReactGA.initialize(process.env.ANALYTICS_ID);
    pageview();
  }
}

export function pageview(pathname?: string): void {
  const page = pathname ?? globalThis.location.pathname;
  let analyticsPath = page;

  // remove matchID param from /matches/<matchID> URLs
  if (/matches\/[\w-]+/i.test(page)) {
    analyticsPath = "/matches/match-id";
  }
  ReactGA.send({ hitType: "pageview", page: analyticsPath });
}

export function finishedGameEventGA(numPlayers: NumPlayers): void {
  ReactGA.event("Finished Game", {
    category: "Game",
    value: numPlayers,
  });
}

export function createdGameEventGA(numPlayers: NumPlayers): void {
  ReactGA.event("Created new game", {
    category: "Game",
    value: numPlayers,
  });
}

export function copiedGameLinkEventGA(): void {
  ReactGA.event("Copied game link", {
    category: "User",
  });
}

export function copiedScoreLinkEventGA(): void {
  ReactGA.event("Copied game link", {
    category: "User",
  });
}

export function joinedGameEventGA(): void {
  ReactGA.event("Joined Game", {
    category: "Game",
  });
}

export function leftGameEventGA(): void {
  ReactGA.event("Left Game", {
    category: "Game",
  });
}

export function createdProfileEventGA(): void {
  ReactGA.event("Created new user profile", {
    category: "User",
  });
}

export function startedGameEventGA(): void {
  ReactGA.event("Started Game", {
    category: "Game",
  });
}
