import type { User } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth";
import { useEffect } from "react";
import { useFirebaseAuth } from "./auth-provider";
import { useEnhancedState } from "./utils";

interface IdTokenHookReturn {
  token: string | null | undefined;
  loading: boolean;
  error: Error | null | undefined;
}

export default function IdTokenHook(): IdTokenHookReturn {
  const { auth } = useFirebaseAuth();
  const { error, loading, setError, setValue, value } = useEnhancedState<
    string | null,
    Error
  >(() => null);

  useEffect(() => {
    async function getToken(user: User): Promise<string> {
      return user.getIdToken();
    }
    async function handleGetToken(user: User | null): Promise<void> {
      if (user) {
        const token = await getToken(user);
        setValue(token);
      }
    }

    const unsubscribe = onIdTokenChanged(
      auth,
      (user) => {
        void handleGetToken(user);
      },
      setError
    );

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return { token: value, loading, error };
}
