import { ActionFunction, json, LinksFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import stylesUrl from '../styles/login.css'
import { getSession, commitSession } from "../sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );

  if (session.has("userId")) {
    return redirect("/");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const action: ActionFunction = async({ request }) =>  {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const form = await request.formData();
  const password = form.get("password");

  const userId = password === process.env.WEBSITE_PASSWORD ? 1 : null;

  if (userId == null) {
    session.flash("error", "Invalid password");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    });
  }

  session.set("userId", userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}

export default function Login() {
  const { error } = useLoaderData();

  return (
    <div className="login__wrapper">
      {error ? <div className="error">{error}</div> : null}
      <form className="login__form" method="POST">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
