import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AppointmentChart({ appointments = [] }) {
  // Transform appointments into monthly completed/cancelled counts
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const zero = () => ({ Completed: 0, Cancelled: 0 });
  const byMonth = Array.from({ length: 12 }).map(() => zero());

  appointments.forEach((a) => {
    try {
      const d = new Date(a.date);
      if (!isNaN(d)) {
        const m = d.getMonth();
        const status = (a.status || "").toLowerCase();
        if (status === "cancelled") byMonth[m].Cancelled += 1;
        else byMonth[m].Completed += 1;
      }
    } catch (e) {
      // ignore malformed dates
    }
  });

  const data = months.map((name, idx) => ({ name, ...byMonth[idx] }));

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Appointment Statistics</h3>
        <div className="text-sm text-gray-500">Monthly</div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Completed" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Cancelled" fill="#60a5fa" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
