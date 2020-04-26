import ReactGA from "react-ga";

export function initializeGA(): void {
  if (process.env.ANALYTICS_ID) {
    ReactGA.initialize(process.env.ANALYTICS_ID);
    pageview();
  }
}

export function pageview(location?: { pathname: string }): void {
  const pathname = location?.pathname ?? window.location.pathname;
  let analyticsPath = pathname;
  if (pathname.match(/games\/[\w-]+/i)) {
    analyticsPath = "/games/game-id";
  }
  ReactGA.pageview(analyticsPath);
}
