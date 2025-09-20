import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";
import { resolveRoute } from "./presentation/hooks/useRouter";

interface RenderResult {
  appHtml: string;
  initialRoute: ReturnType<typeof resolveRoute>;
  status: number;
}

const KNOWN_ROUTES = new Set(["/", "/wishlist"]);

export async function render(url: string): Promise<RenderResult> {
  const path = url.split("?")[0] ?? "/";
  const route = resolveRoute(path);

  const appHtml = renderToString(
    <StrictMode>
      <App initialRoute={route} />
    </StrictMode>
  );

  const status = KNOWN_ROUTES.has(path) ? 200 : 404;

  return {
    appHtml,
    initialRoute: route,
    status,
  };
}
