import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3">
      <h1 className="text-lg font-semibold">Welcome, {user?.name || 'Admin'}</h1>
      <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
    </div>
  );
}
