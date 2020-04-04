import * as Sentry from "@sentry/browser";

if (
  ["production", "stage"].includes(process.env.NODE_ENV!) ||
  process.env.SENTRY_ENABLE_IN_DEV === "true"
) {
  // bootstrap sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}
