import React from "react";

export default function StatCard({ title, value, percent, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">{title}</p>
        <span className={`text-xs font-semibold ${color}`}>
          {percent >= 0 ? `↑ ${percent}%` : `↓ ${Math.abs(percent)}%`}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
}
