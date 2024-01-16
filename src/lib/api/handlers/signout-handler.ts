import { StatusCodes } from "http-status-codes";
import { DEFAULT_HEADERS } from "./constants";

export default async function singoutHandler(
  request: Request
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(undefined, {
      status: StatusCodes.METHOD_NOT_ALLOWED,
      headers: {
        ...DEFAULT_HEADERS,
      },
    });
  }

  try {
    await request.json();
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Invalid JSON",
        },
      }),
      {
        status: StatusCodes.BAD_REQUEST,
        headers: {
          ...DEFAULT_HEADERS,
        },
      }
    );
  }

  // add csrfToken validation here
  // const { csrfToken } = (await request.json()) as Record<string, unknown>;
  // if (!csrfToken || typeof csrfToken !== "string") {
  //   return new Response(
  //     JSON.stringify({
  //       error: {
  //         message: "Invalid csrfToken",
  //       },
  //     }),
  //     {
  //       status: StatusCodes.UNAUTHORIZED,
  //       headers: {
  //         ...DEFAULT_HEADERS,
  //       },
  //     }
  //   );
  // }

  return new Response(undefined, {
    headers: {
      ...DEFAULT_HEADERS,
      "Set-Cookie": `__session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
    },
    status: StatusCodes.NO_CONTENT,
  });
}
