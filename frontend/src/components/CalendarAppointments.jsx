import React, { useState } from "react";
import Avatar from "./Avatar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarAppointments({ appointments = [] }) {
  const [value, setValue] = useState(new Date());

  const upcoming = appointments
    .filter((a) => a.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="bg-white p-5 rounded-2xl shadow h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4">Appointments</h3>
        <Calendar
          onChange={setValue}
          value={value}
          className="mx-auto border-none rounded-lg shadow-sm"
        />
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          General Appointments
        </h4>
        <ul className="space-y-3">
          {upcoming.length === 0 && (
            <li className="text-gray-400">No upcoming appointments</li>
          )}
          {upcoming.map((a, i) => (
            <li
              key={a._id || i}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {a.doctorName || "Unknown Doctor"}
                </p>
                <p className="text-xs text-gray-500">{a.date} {a.time}</p>
              </div>
              <div className="flex -space-x-2">
                <Avatar src={a.patientImage} name={a.patientName || a.doctorName} size={32} className="border-2 border-white" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-center">
        <button className="text-blue-600 text-sm font-medium hover:underline">
          View All Appointments
        </button>
      </div>
    </div>
  );
}
