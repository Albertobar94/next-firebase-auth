import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { NextFirebaseConfig } from "../types";
import { assertRequest } from "../utils/assert-request";
import { CSRFTokenManager } from "../utils/csrf-token";
import {
  DEFAULT_AUTH_COOKIE_NAME,
  DEFAULT_CSRF_COOKIE_NAME,
} from "./constants";
import { requestIsSignin } from "./request.types";

export async function signinHandler(
  request: NextRequest,
  globalConfig: NextFirebaseConfig
): Promise<NextResponse> {
  const csrfCookieName =
    globalConfig.cookies?.csrfToken?.name || DEFAULT_CSRF_COOKIE_NAME;
  const authCookieName =
    globalConfig.cookies?.authToken?.name || DEFAULT_AUTH_COOKIE_NAME;
  const cookie = cookies().get(csrfCookieName);

  try {
    const internalRequest = await assertRequest(
      request,
      "signin",
      globalConfig
    );
    if (requestIsSignin(internalRequest)) {
      const { body, config } = internalRequest;
      const { isVerified } = await CSRFTokenManager.validateCSRFToken(
        body.csrfToken,
        cookie,
        config.secret
      );
      if (isVerified) {
        // TODO: future feature - await globalConfig.auth.auth().verifyIdToken(body.idToken);
        cookies().set(
          authCookieName,
          body.idToken,
          globalConfig.cookies?.authToken?.options
        );

        return NextResponse.json(
          {
            success: true,
          },
          {
            status: StatusCodes.OK,
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Unauthorized",
        },
      },
      {
        status: StatusCodes.UNAUTHORIZED,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: (error as Error).message,
        },
      },
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
}
