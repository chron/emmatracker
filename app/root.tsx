import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "remix";
import type { MetaFunction, LinksFunction } from "remix";
import globalStylesUrl from "~/styles/global.css";
import resetStylesUrl from "~/styles/reset.css";

export const meta: MetaFunction = () => {
  return { title: "emmatracker™" };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter&display=swap" },
    { rel: "stylesheet", href: resetStylesUrl },
    { rel: "stylesheet", href: globalStylesUrl },
    { rel: "icon", href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦄</text></svg>" },
  ];
};

export default function App() {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
