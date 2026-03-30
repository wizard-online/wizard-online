import { defineConfig, loadEnv, Plugin } from "vite";
import { execSync } from "child_process";

function getGitDescribe(): string {
  try {
    return execSync("git describe --always --dirty", { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

/**
 * Replace process.env.* references in source files.
 * Vite's built-in `define` doesn't replace process.env in source files during dev,
 * so we use a custom transform plugin.
 */
function envReplacePlugin(envValues: Record<string, string>): Plugin {
  const replacements = Object.entries(envValues).map(([key, value]) => ({
    search: `process.env.${key}`,
    replace: JSON.stringify(value),
  }));

  return {
    name: "env-replace",
    enforce: "pre",
    transform(code, id) {
      // Only transform source files, not node_modules
      if (id.includes("node_modules")) return;
      let result = code;
      for (const { search, replace } of replacements) {
        // Also handle process.env.X! (TypeScript non-null assertion)
        result = result.split(search + "!").join(replace);
        result = result.split(search).join(replace);
      }
      if (result !== code) return { code: result, map: null };
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const envValues: Record<string, string> = {
    NODE_ENV: mode,
    API_URL: env.API_URL || "",
    SENTRY_DSN: env.SENTRY_DSN || "",
    SENTRY_ENABLE_IN_DEV: env.SENTRY_ENABLE_IN_DEV || "",
    ANALYTICS_ID: env.ANALYTICS_ID || "",
    FEEDBACK_FORM: env.FEEDBACK_FORM || "",
    BOARDGAME_DEBUG: env.BOARDGAME_DEBUG || "",
    GIT_DESCRIBE: getGitDescribe(),
    npm_package_version: process.env.npm_package_version || "",
  };

  return {
    plugins: [envReplacePlugin(envValues)],
    // Use esbuild's built-in JSX support (classic mode for React 16)
    esbuild: {
      jsx: "transform",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    },
    publicDir: "public",
    build: {
      outDir: "dist/app",
    },
    server: {
      port: 1234,
      // Allow access from forwarded ports in devcontainers/codespaces
      host: true,
      hmr: {
        // Use WebSocket over the same HTTP connection (works through port forwarding)
        clientPort: 443,
        protocol: "wss",
      },
    },
    define: {
      // Global __DEV__ flag for immer (used by boardgame.io)
      __DEV__: mode !== "production",
    },
  };
});
