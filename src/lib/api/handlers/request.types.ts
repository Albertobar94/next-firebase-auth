import * as z from "zod";

export const singninRequest = z.object({
  method: z.literal("POST"),
  type: z.literal("signin"),
  body: z.object({
    idToken: z.string(),
    csrfToken: z.string(),
  }),
  config: z.object({
    secret: z.string(),
  }),
});
export type SigninRequest = z.infer<typeof singninRequest>;

export function requestIsSignin(request: unknown): request is SigninRequest {
  const { success } = singninRequest.safeParse(request);
  return success;
}

export const singoutRequest = z.object({
  method: z.literal("POST"),
  type: z.literal("signout"),
  body: z.object({
    csrfToken: z.string(),
  }),
  config: z.object({
    secret: z.string(),
  }),
});
export type SignoutRequest = z.infer<typeof singoutRequest>;
export function requestIsSignout(request: unknown): request is SignoutRequest {
  const { success } = singoutRequest.safeParse(request);
  return success;
}

export const csrfRequest = z.object({
  type: z.literal("csrf"),
  method: z.literal("GET"),
  config: z.object({
    secret: z.string(),
  }),
});

export type CSRFRequest = z.infer<typeof csrfRequest>;
export function requestIsCSRF(request: unknown): request is CSRFRequest {
  const { success } = csrfRequest.safeParse(request);
  return success;
}
