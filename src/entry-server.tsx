import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App.tsx";
import { resolveRoutePath, type AppRoute } from "./presentation/routing/routes";

interface RenderOptions {
  onShellReady?: () => void;
  onShellError?: (error: Error) => void;
  onAllReady?: () => void;
  onError?: (error: Error) => void;
}

interface RenderResult {
  stream: { pipe: (writable: NodeJS.WritableStream, options?: { end?: boolean }) => NodeJS.WritableStream; route: AppRoute };
  initialRoute: AppRoute;
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
  const rawPath = url.split("?")[0] ?? "/";
  const initialRoute = resolveRoutePath(rawPath);
  const status = getRouteStatus(rawPath);

  const { pipe } = renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialRoute={initialRoute} />
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
    stream: { pipe, route: initialRoute },
    initialRoute,
    status,
  };
}

// Legacy function for backwards compatibility - falls back to sync rendering
export async function renderToString(url: string) {
  const rawPath = url.split("?")[0] ?? "/";
  const initialRoute = resolveRoutePath(rawPath);
  const status = getRouteStatus(rawPath);

  // For backwards compatibility, use the old sync approach
  const { renderToString: syncRenderToString } = await import("react-dom/server");

  const appHtml = syncRenderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App initialRoute={initialRoute} />
      </StaticRouter>
    </StrictMode>,
  );

  return {
    appHtml,
    initialRoute,
    status,
  };
}
