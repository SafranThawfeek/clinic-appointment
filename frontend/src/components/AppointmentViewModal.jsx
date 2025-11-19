import React from "react";
import Avatar from "./Avatar";

export default function AppointmentViewModal({ open, onClose, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Appointment Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-3 text-gray-700">
          <div className="flex items-center gap-3">
            <Avatar src={data.patientImage} name={data.patientName} size={48} className="border" />
            <div>
              <div className="font-medium">{data.patientName}</div>
              <div className="text-xs text-gray-500">{data.patientPhone}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar src={data.doctorImage} name={data.doctorName} size={48} className="border" />
            <div>
              <div className="font-medium">{data.doctorName}</div>
              <div className="text-xs text-gray-500">{data.doctorSpeciality || data.specialization}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium">{data.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="font-medium">{data.time}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mode</p>
              <p className="font-medium">{data.mode}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium">{data.status}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
