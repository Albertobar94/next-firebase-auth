import type {
  AuthError,
  CustomParameters,
  UserCredential,
} from "firebase/auth";
import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFirebaseAuth } from "./auth-provider";
import { getCsrfToken, serverSignin, serverSignout } from "./utils/fetchers";
import { initGoogleProvider } from "./utils/init-provider";

export interface SigninHookOptions {
  onSignin?: (result: UserCredential) => Promise<void>;
  type?: "popup" | "redirect";
  scopes?: string[];
  customOAuthParameters?: CustomParameters;
}

export type GoogleSigninHook = [
  () => Promise<boolean | UserCredential | undefined>,
  {
    loading: boolean;
    error: AuthError | Error | undefined;
  },
];

// eslint-disable-next-line sonarjs/cognitive-complexity -- Readable
export default function GoogleSigninHook(
  props?: SigninHookOptions
): GoogleSigninHook {
  const {
    onSignin,
    type = "redirect",
    scopes,
    customOAuthParameters,
  } = props || {};
  const router = useRouter();
  const { auth } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | Error>();

  const signinWithRedirect = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithRedirect(
        auth,
        initGoogleProvider(scopes, customOAuthParameters)
      );
      return true;
    } catch (error) {
      setError(error as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);
  const signinWithPopup = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await signInWithPopup(
        auth,
        initGoogleProvider(scopes, customOAuthParameters)
      );
      const csrfToken = await getCsrfToken();
      await serverSignin(await result.user.getIdToken(), csrfToken);
      if (onSignin) {
        // Add API Error
        await onSignin(result);
      }
      return result;
    } catch (err) {
      await signOut(auth);
      await serverSignout("csrfToken");
      // Check for which type of error
      setError(err as Error);
    } finally {
      setLoading(false);
      router.refresh();
    }
  }, [auth]);

  useEffect(() => {
    async function getToken(result: UserCredential): Promise<string> {
      return result.user.getIdToken();
    }
    async function handleSignin(result: UserCredential): Promise<void> {
      const csrfToken = await getCsrfToken();
      await serverSignin(await getToken(result), csrfToken);
      if (onSignin) {
        await onSignin(result);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- temp
    async function handleSignout(error?: unknown): Promise<void> {
      // handle based on error
      await signOut(auth);
      // await serverSignout("csrfToken");
    }
    async function handleRedirectResult(): Promise<void> {
      const result = await getRedirectResult(auth);
      if (result) {
        try {
          await handleSignin(result);
        } catch (error) {
          // handle based on error
          await handleSignout();
          setError(error as Error);
        } finally {
          router.refresh();
        }
      }
    }

    if (type === "redirect") {
      void handleRedirectResult();
    }
  }, [auth.currentUser]);

  const signinFn = type === "redirect" ? signinWithRedirect : signinWithPopup;

  return [signinFn, { loading, error }];
}
