export const API_URL = "http://127.0.0.1:8000";

const fetchWithAuth = async (url, options = {}) => {
  let tokenData = JSON.parse(localStorage.getItem("authTokens"));
  let accessToken = tokenData?.access;
  let refreshToken = tokenData?.refresh;

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${API_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const newTokens = await refreshResponse.json();
      tokenData.access = newTokens.access;
      localStorage.setItem("authTokens", JSON.stringify(tokenData));

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newTokens.access}`,
        },
      });
    } else {
      localStorage.removeItem("authTokens");
      window.location.href = "/login";
      return;
    }
  }

  return response;
};

export default fetchWithAuth;
