import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/api";

const AuthContext = createContext();

const API_URL = "http://localhost:8000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access") || null);
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh") || null
  );

  const isAdmin = user
    ? user.groups.some(
        (group) => group.includes("Admin") || group.includes("Manager")
      ) || user.is_superuser
    : false;
  console.log("isAdmin: ", isAdmin);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access && user === null) {
      getMe(access)
        .then((me) => {
          setUser(me);
          setToken(access);
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = (access, refresh, userData) => {
    setUser(userData);
    setToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) throw new Error("No se pudo renovar token");

      const data = await response.json();
      setToken(data.access);
      localStorage.setItem("access", data.access);
      return data.access;
    } catch (err) {
      console.error("Error refrescando token", err);
      logout();
      return null;
    }
  };

  const getValidToken = async () => {
    return token || (await refreshAccessToken());
  };

  console.log("TOKEN:", token);
  console.log("REFRESH:", refreshToken);
  console.log("USER:", user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshAccessToken,
        getValidToken,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
