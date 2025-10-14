import React, { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null);

  async function login(credentials) {
    const res = await apiLogin(credentials);
    const { token } = res.data;
    localStorage.setItem('token', token);
    setUser(jwtDecode(token));
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
