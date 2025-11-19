import React, { useEffect, useState } from "react";
import { getDoctors } from "../api/doctorApi";

export default function NewAppointmentModal({ open, onClose, onSave }) {
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
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoadingDoctors(true);
      try {
        const res = await getDoctors();
        setDoctors(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDoctors(false);
      }
    };
    load();
  }, [open]);

  // debug: log when modal mounts/opens
  useEffect(() => {
    if (open) console.log('NewAppointmentModal opened');
  }, [open]);

  if (!open) return null;

  const update = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // when doctor selected populate specialty
  const handleDoctorSelect = (id) => {
    const d = doctors.find((x) => x._id === id);
    setForm((p) => ({ ...p, doctorName: d?.name || "", doctorSpeciality: d?.specialization || "" }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      {/* debug badge to confirm modal rendered (remove later) */}
      <div style={{position: 'fixed', left: 12, top: 12, zIndex: 60, background: 'rgba(255,0,0,0.85)', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12}}>Modal open</div>
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="patientName" value={form.patientName} onChange={update} placeholder="Patient Name" className="border p-2 rounded" />
          <input name="patientPhone" value={form.patientPhone} onChange={update} placeholder="Patient Phone" className="border p-2 rounded" />

          <select name="doctorName" value={form.doctorName} onChange={(e) => handleDoctorSelect(e.target.value)} className="border p-2 rounded">
            <option value="">Select doctor (optional)</option>
            {!loadingDoctors && doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>)}
          </select>

          <input name="doctorSpeciality" value={form.doctorSpeciality} onChange={update} placeholder="Speciality" className="border p-2 rounded" />

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

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={() => {
            const selectedDoctor = doctors.find(d => d._id === form.doctorName);
            const payload = {
              patientName: form.patientName,
              patientPhone: form.patientPhone,
              doctorName: selectedDoctor ? selectedDoctor.name : form.doctorName,
              doctorSpeciality: form.doctorSpeciality,
              date: form.date,
              time: form.time,
              mode: form.mode,
              status: form.status,
            };
            onSave(payload);
          }} className="px-4 py-2 bg-blue-700 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
