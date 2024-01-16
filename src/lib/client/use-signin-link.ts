import type { ActionCodeSettings, AuthError } from "firebase/auth";
import { sendSignInLinkToEmail as fbSendSignInLinkToEmail } from "firebase/auth";
import { useCallback, useState } from "react";
import { useFirebaseAuth } from "./auth-provider";
import { serverSignout } from "./utils/fetchers";

export interface SigninHookOptions {
  onSignin?: () => Promise<void>;
}

export type SendSignInLinkToEmailHook = [
  (email: string, actionCodeSettings: ActionCodeSettings) => Promise<boolean>,
  {
    loading: boolean;
    error: AuthError | Error | undefined;
  },
];

export default function SigninLinkToEmailHook(
  options?: SigninHookOptions
): SendSignInLinkToEmailHook {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);
  const { auth } = useFirebaseAuth();

  const sendSigninLinkToEmail = useCallback(
    async (email: string, actionCodeSettings: ActionCodeSettings) => {
      setLoading(true);
      setError(undefined);
      try {
        await fbSendSignInLinkToEmail(auth, email, actionCodeSettings);
        if (options?.onSignin) {
          await options.onSignin();
        }
        return true;
      } catch (err) {
        await auth.signOut();
        await serverSignout("csrfToken");
        // Set the right error
        setError(err as AuthError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  return [sendSigninLinkToEmail, { loading, error }];
}
