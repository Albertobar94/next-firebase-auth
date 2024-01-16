type ErrorType = "MissingCSRFTokenError" | undefined;

type ErrorOrigin = "ApiInternal" | "ApiExternal" | "FirebaseAuth" | undefined;

export class NextFirebaseError extends Error {
  public type: ErrorType;
  public origin: ErrorOrigin;
  public name: string;
  public cause?: Record<string, unknown> & { error?: Error };

  constructor(
    message: string,
    cause?: Record<string, unknown> & { error?: Error }
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.cause = cause;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidCSRFCookieOrTokenError extends NextFirebaseError {
  static type = "InvalidCSRFCookieOrTokenError";
  static origin = "ApiInternal";
}

export class MissingCSRFCookieError extends NextFirebaseError {
  static type = "MissingCSRFCookieError";
  static origin = "ApiInternal";
}

export class MissingSecret extends NextFirebaseError {
  static type = "MissingSecret";
  static origin = "ApiInternal";
}

export class MethodNotAllowedError extends NextFirebaseError {
  static type = "MethodNotAllowedError";
  static origin = "ApiInternal";
}

export class MissingBodyError extends NextFirebaseError {
  static type = "MissingBodyError";
  static origin = "ApiInternal";
}

export class InvalidRequestError extends NextFirebaseError {
  static type = "InvalidRequestError";
  static origin = "ApiInternal";
}
