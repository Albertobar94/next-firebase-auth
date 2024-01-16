import type { NextApiHandler } from "next";

export interface LoggerInstance {
  warn: (message: string) => void;
  error: (error: Error) => void;
  debug: (message: string, metadata?: unknown) => void;
}

export interface CookieSerializeOptions {
  domain?: string | undefined;

  expires?: Date | undefined;

  httpOnly?: boolean | undefined;

  maxAge?: number | undefined;

  path?: string | undefined;

  sameSite?: true | false | "lax" | "strict" | "none" | undefined;

  secure?: boolean | undefined;
}

export interface CookieOption {
  name: string;
  options: CookieSerializeOptions;
}

export interface CookiesOptions {
  csrfToken: Partial<CookieOption>;
  authToken: Partial<CookieOption>;
}

export type AppRouteHandlers = Record<"GET" | "POST", NextApiHandler>;

export interface NextFirebaseConfig {
  secret?: string;
  debug?: boolean;
  logger?: Partial<LoggerInstance>;
  cookies?: Partial<CookiesOptions>;
}

export interface NextFirebaseResult {
  handlers: AppRouteHandlers;
}
