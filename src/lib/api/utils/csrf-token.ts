/* eslint-disable @typescript-eslint/no-magic-numbers -- temp */
/**
 * Ensure CSRF Token cookie is set for any subsequent requests.
 * Used as part of the strategy for mitigation for CSRF tokens.
 *
 * Creates a cookie like 'next-auth.csrf-token' with the value 'token|hash',
 * where 'token' is the CSRF token and 'hash' is a hash made of the token and
 * the secret, and the two values are joined by a pipe '|'. By storing the
 * value and the hash of the value (with the secret used as a salt) we can
 * verify the cookie was set by the server and not by a malicious attacker.
 *
 * For more details, see the following OWASP links:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 * https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
 */

import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import {
  InvalidCSRFCookieOrTokenError,
  MissingCSRFCookieError,
} from "../../common/errors";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- no need to instantiate
export class CSRFTokenManager {
  public static async createCSRFToken(secret: string | undefined): Promise<{
    cookie: string;
    csrfToken: string;
  }> {
    const csrfToken = CSRFTokenManager.randomString(32);
    const csrfTokenHash = await CSRFTokenManager.createHash(
      `${csrfToken}${secret}`
    );
    const cookie = `${csrfToken}|${csrfTokenHash}`;

    return { cookie, csrfToken };
  }

  public static async validateCSRFToken(
    csrfTokenPayload: string,
    csrfCookie: RequestCookie | undefined,
    secret: string
  ): Promise<{
    isVerified: boolean;
    csrfToken: string;
  }> {
    if (csrfCookie) {
      const [csrfToken, csrfTokenHash] = csrfCookie.value.split("|");

      const expectedCsrfTokenHash = await CSRFTokenManager.createHash(
        `${csrfToken}${secret}`
      );
      if (csrfTokenHash === expectedCsrfTokenHash) {
        return { isVerified: csrfToken === csrfTokenPayload, csrfToken };
      }

      throw new InvalidCSRFCookieOrTokenError(`Invalid CSRF cookie or token.`);
    }

    throw new MissingCSRFCookieError(`Missing CSRF cookie.`);
  }

  private static randomString(size: number): string {
    const i2hex = (i: number) => `0${i.toString(16)}`.slice(-2);
    const r = (a: string, i: number): string => a + i2hex(i);
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    return Array.from(bytes).reduce(r, "");
  }

  private static async createHash(message: string): Promise<string> {
    const data = new TextEncoder().encode(message);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toString();
  }
}
