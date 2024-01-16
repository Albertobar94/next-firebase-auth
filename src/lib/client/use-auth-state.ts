import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useFirebaseAuth } from "./auth-provider";
import { useEnhancedState } from "./utils";

interface AuthStateOptions {
  onUserChanged?: (user: User | null) => Promise<void>;
}

interface AuthStateHookReturn {
  user: User | null | undefined;
  loading: boolean;
  error: Error | null | undefined;
}

export default function AuthStateHook(
  options?: AuthStateOptions
): AuthStateHookReturn {
  const { auth } = useFirebaseAuth();
  const { error, loading, setError, setValue, value } = useEnhancedState<
    User | null,
    Error
  >(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (options?.onUserChanged) {
          // Does this error triggers a singout?
          options.onUserChanged(user).catch((e) => {
            setError(e as Error);
          });
        }
        setValue(user);
      },
      setError
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return { user: value, loading, error };
}
