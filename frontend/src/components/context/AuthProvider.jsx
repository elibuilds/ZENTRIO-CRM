import { createContext, useState } from "react";

const AuthContext = createContext({});

const API_BASE = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // null = logged out, otherwise { username, role }

  async function login(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error || "Login failed");
    }

    setAuth({ username: body.username, role: body.role });
    return body;
  }

  async function signup(username, email, password) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(body.error || "Signup failed");
    }

    return body;
  }

  async function logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setAuth(null);
  }

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
