import React, { useState, useEffect } from "react";

export default function AppointmentEditModal({ open, onClose, data, onSave }) {
  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    doctorName: "",
    doctorSpeciality: "",
    date: "",
    time: "",
    mode: "In-Person",
    status: "Scheduled",
  });

  useEffect(() => {
    if (data) setForm({ ...form, ...data });
    // eslint-disable-next-line
  }, [data]);

  if (!open || !data) return null;

  const update = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="patientName" value={form.patientName} onChange={update} className="border p-2 rounded" placeholder="Patient Name" />
          <input name="patientPhone" value={form.patientPhone} onChange={update} className="border p-2 rounded" placeholder="Patient Phone" />
          <input name="doctorName" value={form.doctorName} onChange={update} className="border p-2 rounded" placeholder="Doctor Name" />
          <input name="doctorSpeciality" value={form.doctorSpeciality} onChange={update} className="border p-2 rounded" placeholder="Speciality" />
          <input name="date" type="date" value={form.date} onChange={update} className="border p-2 rounded" />
          <input name="time" type="time" value={form.time} onChange={update} className="border p-2 rounded" />
          <select name="mode" value={form.mode} onChange={update} className="border p-2 rounded">
            <option>In-Person</option>
            <option>Online</option>
          </select>
          <select name="status" value={form.status} onChange={update} className="border p-2 rounded">
            <option>Scheduled</option>
            <option>Confirmed</option>
            <option>CheckedIn</option>
            <option>CheckedOut</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 bg-blue-700 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
