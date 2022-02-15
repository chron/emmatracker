import { createCookieSessionStorage } from "remix";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",

      // domain: "emmatracker.netlify.app/",
      // expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      // maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET!],
      secure: true
    }
  });

export { getSession, commitSession, destroySession };
