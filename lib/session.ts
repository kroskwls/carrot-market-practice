import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionContent {
  id?: number;
}

export const getSession = () => {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-carrot",
    password: process.env.COOKIE_PASSWORD!
  });
}

export const saveSession = async (id: number, redirectUrl: string) => {
  const session = await getSession();
  session.id = id;
  await session.save();

  redirect(redirectUrl);
}