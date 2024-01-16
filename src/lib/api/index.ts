import type { NextRequest } from "next/server";
import { AuthHandler } from "./handlers";
import type { NextFirebaseConfig } from "./types";

export default function NextFirebase(config: NextFirebaseConfig) {
  const httpHandler = (
    req: NextRequest,
    params: { params: { handlers: ("signin" | "signout" | "csrf")[] } }
  ) => AuthHandler(req, params, config);
  return {
    GET: httpHandler,
    POST: httpHandler,
  };
}
