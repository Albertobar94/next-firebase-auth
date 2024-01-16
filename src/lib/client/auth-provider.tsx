import type { Auth } from "firebase/auth";
import * as React from "react";

export interface FirebaseAuthContext {
  auth: Auth;
}

export const Context = React.createContext<FirebaseAuthContext>(
  {} as unknown as FirebaseAuthContext
);

export function FirebaseAuthProvider({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: Auth;
}): JSX.Element {
  return (
    <Context.Provider
      value={{
        auth,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useFirebaseAuth = (): FirebaseAuthContext =>
  React.useContext(Context);
