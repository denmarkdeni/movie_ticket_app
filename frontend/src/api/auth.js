import { apiJson, setTokens } from "./client";

export async function register(email, password, firstName = "", lastName = "") {
  return apiJson("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  });
}

export async function login(email, password) {
  const data = await apiJson("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access, data.refresh);
  return data;
}
