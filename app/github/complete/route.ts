import db from "@/lib/db";
import { saveSession } from "@/lib/session";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

interface UserInformation {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }

  const accessToken = await getAccessToken(code);
  if (accessToken === "error") {
    new Response(null, { status: 400 });
  }

  const userInformation = await getUserInformation(accessToken);
  await login(userInformation);
}

const getAccessToken = async (code: string): Promise<string> => {
  const tokenBaseUrl = "https://github.com/login/oauth/access_token";
  const tokenParams = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code
  };
  const tokenFormattedParams = new URLSearchParams(tokenParams).toString();
  const tokenFinalUrl = `${tokenBaseUrl}?${tokenFormattedParams}`;
  const tokenResponse = await fetch(tokenFinalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });
  const tokenData = await tokenResponse.json();
  if ("error" in tokenData) {
    return "error";
  }

  const { access_token } = tokenData;
  return access_token;
};

const getUserInformation = async (accessToken: string): Promise<UserInformation> => {
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  const infoBaseUrl = "https://api.github.com/user";
  const infoResponse = await fetch(infoBaseUrl, {
    headers, cache: "no-cache"
  });

  const emailBaseUrl = "https://api.github.com/user/emails";
  const emailResponse = await fetch(emailBaseUrl, {
    headers, cache: "no-cache"
  });

  const emailData = await emailResponse.json();
  let email;
  if (emailData.length > 0) {
    email = emailData[0].email;
  }

  const { id, avatar_url: avatar, name } = await infoResponse.json();
  return { id: String(id), name, email, avatar };
};

const login = async ({ id, name, email, avatar }: UserInformation) => {
  const user = await db.user.findUnique({
    where: { github_id: id },
    select: { id: true }
  });

  if (user) {
    return await saveSession(user.id, "/profile");
  }

  const newUser = await db.user.create({
    data: {
      name: name,
      github_id: id,
      avatar,
      email
    }
  });

  return await saveSession(newUser.id, "/profile");
};