export async function serverSignin(
  idToken: string,
  csrfToken: string
): Promise<Response> {
  const response = await fetch(`/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, csrfToken }),
  });
  if (!response.ok) {
    // Add Internal Api Error
    throw new Error("Failed to signin");
  }

  return response;
}

export function serverSignout(csrfToken: string): Promise<Response> {
  return fetch("/api/auth/signout", {
    method: "POST",
    body: JSON.stringify({ csrfToken }),
  });
}

export async function getCsrfToken(): Promise<string> {
  const response = await fetch("/api/auth/csrf", {
    credentials: "same-origin",
  });
  const { data } = (await response.json()) as { data: { csrfToken: string } };

  return data.csrfToken;
}
