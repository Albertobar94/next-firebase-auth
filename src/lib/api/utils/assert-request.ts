import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import { InvalidRequestError } from "../../common/errors";
import {
  csrfRequest,
  requestIsSignin,
  requestIsSignout,
  singninRequest,
  singoutRequest,
} from "../handlers/request.types";
import type { NextFirebaseConfig } from "../types";

export async function assertRequest(
  request: NextRequest,
  type: "signin" | "signout" | "csrf",
  config: NextFirebaseConfig
) {
  const internalRequest = {
    method: request.method,
    body: request.method === "POST" && ((await request.json()) as unknown),
    type,
    config,
  } as unknown;

  try {
    if (requestIsSignin(internalRequest)) {
      const { body, type, method, config } =
        singninRequest.parse(internalRequest);
      return {
        method,
        type,
        body,
        config,
      };
    } else if (requestIsSignout(internalRequest)) {
      const { body, type, method, config } =
        singoutRequest.parse(internalRequest);
      return {
        method,
        type,
        body,
        config,
      };
    }

    const { method, type, config } = csrfRequest.parse(internalRequest);
    return {
      method,
      type,
      body: null,
      config,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      error.errors.forEach((err) => {
        if (err.code === "invalid_type") {
          throw new InvalidRequestError(`Invalid request body: ${err.message}`);
        }

        if (err.code === "invalid_literal") {
          throw new InvalidRequestError(
            `Invalid request method: ${err.message}`
          );
        }
      });
    }

    throw new InvalidRequestError("Invalid request");
  }
}
