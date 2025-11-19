import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin } from '../api/authApi';

// Minimal JWT decode helper (only decodes payload, no signature verification)
function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // atob works in browsers; replace URL-safe chars
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // initialize from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        setUser(decoded);
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    const res = await apiLogin(credentials);
  const token = res.data.token;
  localStorage.setItem('token', token);
  setUser(decodeJwt(token));
    return res;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
