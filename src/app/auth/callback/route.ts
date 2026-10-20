import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { DASHBOARD_PATH, LOGIN_PATH } from "@/modules/auth/paths";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = searchParams.get("next") ?? DASHBOARD_PATH;

  if (!code) {
    return NextResponse.redirect(new URL(LOGIN_PATH, origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`${LOGIN_PATH}?error=auth`, origin));
  }

  const redirectPath = nextPath.startsWith("/") ? nextPath : DASHBOARD_PATH;
  return NextResponse.redirect(new URL(redirectPath, origin));
}
