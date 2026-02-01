import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(localStorage.getItem("username")); 
  const [email, setemail] = useState(localStorage.getItem("email")); 

  const login = (username, accessToken, useremail) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("username", username);
    localStorage.setItem("email", useremail);
    setToken(accessToken);
    setUser(username);
    setemail(useremail); 
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setemail(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout,email }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);