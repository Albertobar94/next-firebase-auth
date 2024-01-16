import { StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { NextFirebaseConfig } from "../types";
import { CSRFTokenManager } from "../utils/csrf-token";
import { DEFAULT_CSRF_COOKIE_NAME } from "./constants";
import { requestIsCSRF } from "./request.types";

export async function csrfTokenHandler(
  request: NextRequest,
  globalConfig: NextFirebaseConfig
): Promise<NextResponse> {
  const csrfCookieName =
    globalConfig.cookies?.csrfToken?.name || DEFAULT_CSRF_COOKIE_NAME;
  const internalRequest = {
    body: request.body,
    method: request.method,
    config: globalConfig,
    type: "csrf",
  };

  if (requestIsCSRF(internalRequest)) {
    const { cookie, csrfToken } = await CSRFTokenManager.createCSRFToken(
      globalConfig.secret
    );

    cookies().set({
      ...globalConfig.cookies?.csrfToken?.options,
      name: csrfCookieName,
      value: cookie,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          csrfToken,
        },
      },
      {
        status: StatusCodes.CREATED,
      }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Invalid request",
      },
    },
    {
      status: StatusCodes.BAD_REQUEST,
    }
  );
}
