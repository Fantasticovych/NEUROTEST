import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  authTokens: null,
  loginUser: () => {},
  logoutUser: () => {},
  setUser: () => {},
  setAuthTokens: () => {},
});

export default AuthContext;
