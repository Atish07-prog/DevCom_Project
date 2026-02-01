import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("username")); // Key fix: Store username

  const login = (username, accessToken) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("username", username);
    setToken(accessToken);
    setUser(username); // This updates the state to "Om"
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);