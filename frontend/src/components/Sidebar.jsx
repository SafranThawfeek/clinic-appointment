import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="bg-blue-700 text-white h-screen w-60 p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="hover:bg-blue-600 p-2 rounded">Dashboard</Link>
        <Link to="/doctors" className="hover:bg-blue-600 p-2 rounded">Doctors</Link>
        <Link to="/patients" className="hover:bg-blue-600 p-2 rounded">Patients</Link>
        <Link to="/appointments" className="hover:bg-blue-600 p-2 rounded">Appointments</Link>
      </nav>
    </aside>
  );
}
