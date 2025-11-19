import React from "react";

export default function AppointmentDeleteModal({ open, onClose, onDelete }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-3">Delete Appointment</h3>
        <p className="text-gray-700 mb-4">Are you sure you want to delete this appointment? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}
