import ReactGA from "react-ga";

export function initializeGA(): void {
  if (process.env.ANALYTICS_ID) {
    ReactGA.initialize(process.env.ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
}
