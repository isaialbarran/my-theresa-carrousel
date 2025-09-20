import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.tsx";

interface RenderOptions {
  onShellReady?: () => void;
  onShellError?: (error: Error) => void;
  onAllReady?: () => void;
  onError?: (error: Error) => void;
}

interface RenderResult {
  stream: { pipe: (writable: NodeJS.WritableStream, options?: { end?: boolean }) => NodeJS.WritableStream; route: string };
  initialRoute: string;
  status: number;
}

const KNOWN_ROUTES = new Set(["/", "/wishlist"]);
const MOVIE_ROUTE_PATTERN = /^\/movie\/\d+$/;

function getRouteStatus(path: string): number {
  if (KNOWN_ROUTES.has(path) || MOVIE_ROUTE_PATTERN.test(path)) {
    return 200;
  }
  return 404;
}

export function render(url: string, options: RenderOptions = {}): RenderResult {
  const path = url.split("?")[0] ?? "/";
  const status = getRouteStatus(path);

  const { pipe } = renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialRoute={path} />
      </StaticRouter>
    </StrictMode>,
    {
      bootstrapScripts: ["/src/main.tsx"],
      onShellReady() {
        options.onShellReady?.();
      },
      onShellError(error: unknown) {
        options.onShellError?.(error as Error);
      },
      onAllReady() {
        options.onAllReady?.();
      },
      onError(error: unknown) {
        options.onError?.(error as Error);
      },
    },
  );

  return {
    stream: { pipe, route: path },
    initialRoute: path,
    status,
  };
}

// Legacy function for backwards compatibility - falls back to sync rendering
export async function renderToString(url: string) {
  const path = url.split("?")[0] ?? "/";
  const status = getRouteStatus(path);

  // For backwards compatibility, use the old sync approach
  const { renderToString: syncRenderToString } = await import("react-dom/server");

  const appHtml = syncRenderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialRoute={path} />
      </StaticRouter>
    </StrictMode>,
  );

  return {
    appHtml,
    initialRoute: path,
    status,
  };
}
