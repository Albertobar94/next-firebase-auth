import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { NextFirebaseConfig } from "../types";
import { csrfTokenHandler } from "./csrf-token-handler";
import { signinHandler } from "./signin-handler";

export async function AuthHandler(
  request: NextRequest,
  {
    params: { handlers },
  }: { params: { handlers: ("signin" | "signout" | "csrf")[] } },
  config: NextFirebaseConfig
): Promise<NextResponse> {
  const [handler] = handlers;
  try {
    switch (handler) {
      case "signin":
        return signinHandler(request, config);
      case "signout":
        throw new Error('Not implemented yet: "signout" case');
      case "csrf":
        return csrfTokenHandler(request, config);
      default:
        return NextResponse.json(
          { success: false, error: { message: "Invalid handler" } },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: (error as Error).message } },
      { status: 500 }
    );
  }
}
