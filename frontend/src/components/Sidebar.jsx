import React from "react";
import {
  LayoutDashboard,
  Users,
  UserCircle2,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { name: "Doctors", icon: UserCircle2, to: "/doctors" },
    { name: "Patients", icon: Users, to: "/patients" },
    { name: "Appointments", icon: CalendarDays, to: "/appointments" },
    { name: "Messages", icon: MessageSquare, to: "/messages" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg flex flex-col p-6 border-r">
      <h2 className="text-2xl font-bold text-blue-600 mb-10">Clinic Admin</h2>
      <nav className="space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
