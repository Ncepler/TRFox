import { cookies } from "next/headers";

// Single shared-password gate for /toddles -- not real auth, just enough to
// keep the admin page off the public internet.
const COOKIE_NAME = "toddles_auth";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}

export async function setAuthed(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/toddles",
    maxAge: MAX_AGE_SECONDS,
  });
}
