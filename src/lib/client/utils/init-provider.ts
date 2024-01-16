import type { CustomParameters } from "firebase/auth";
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

export function initGoogleProvider(
  scopes?: string[],
  customOAuthParameters?: CustomParameters
): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  if (scopes) {
    scopes.forEach((scope) => provider.addScope(scope));
  }
  if (customOAuthParameters) {
    provider.setCustomParameters(customOAuthParameters);
  }
  return provider;
}

export function initGithubProvider(
  scopes?: string[],
  customOAuthParameters?: CustomParameters
): GoogleAuthProvider {
  const provider = new GithubAuthProvider();
  if (scopes) {
    scopes.forEach((scope) => provider.addScope(scope));
  }
  if (customOAuthParameters) {
    provider.setCustomParameters(customOAuthParameters);
  }
  return provider;
}
