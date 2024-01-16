import type { AuthError } from "firebase/auth";
import { useCallback, useState } from "react";
import { useFirebaseAuth } from "./auth-provider";
import { serverSignout } from "./utils/fetchers";

export interface SignoutHookOptions {
  onSignout?: () => Promise<void>;
}

export type SignoutHook = [
  () => Promise<boolean>,
  {
    loading: boolean;
    error: AuthError | Error | undefined;
  },
];

export default function SignoutHook(options?: SignoutHookOptions): SignoutHook {
  const [error, setError] = useState<AuthError>();
  const [loading, setLoading] = useState<boolean>(false);
  const { auth } = useFirebaseAuth();

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      await auth.signOut();
      await serverSignout("csrfToken");
      if (options?.onSignout) {
        await options.onSignout();
      }
      return true;
    } catch (err) {
      setError(err as AuthError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return [signOut, { loading, error }];
}
