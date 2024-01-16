# Features

## Ref https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended and https://stackoverflow.com/questions/73313645/is-this-a-valid-way-of-preventing-a-csrf-attack-in-a-next-js-application // name: `__Host-next-auth.csrf-token`,
✅  Signed Double-Submit Cookie csrf protection
✅  Sign in with redirect / popup with Google, Github, Linkedin
✅  Auto-linking - Custom-linking firebase accounts
✅  Internal signin with Server-side validation
✅  Hooks to access internal state i.e. useIdToken() that can be added to graphql

```ts
"use client";

function makeClient(token: string) {
  return function makeClientClosure() {
    const httpLink = new HttpLink({
    uri: '/graphql',
  });

  const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : authLink.concat(httpLink),
  });
  }
}


export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const [{ token }] = useIdToken(auth, options);

  return (
    <ApolloNextAppProvider makeClient={makeClient(token)}>
      {children}
    </ApolloNextAppProvider>
  );
}
```