import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

// array에 뭔가를 포함하고 있는지를 찾는 것보다 object에서 찾는 것이 조금 더 빠름
const onlyPublicUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname
  const exists = onlyPublicUrls[pathname];
  // logout user & no public urls
  if (!session.id && !exists) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // login user & public urls
  if (session.id && exists) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }


}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};