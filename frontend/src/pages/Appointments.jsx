import React, { useState, useEffect } from "react";
import Avatar from "../components/Avatar";
import { getAppointments } from "../api/appointmentApi";
import NewAppointmentModal from "../components/NewAppointmentModal";
import { useSync } from "../context/SyncContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
    // also load doctors and patients to resolve images
    (async () => {
      try {
        const [docRes, patRes] = await Promise.all([import('../api/doctorApi').then(m=>m.getDoctors()), import('../api/patientApi').then(m=>m.getPatients())]);
        // store locally to enrich appointments on fetch
        window.__loadedDoctors = docRes.data || [];
        window.__loadedPatients = patRes.data || [];
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const { notify } = useSync();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments();
      const appts = Array.isArray(res.data) ? res.data : (res.data || []);
      // enrich with images using loaded doctors/patients when available
      const docs = window.__loadedDoctors || [];
      const pats = window.__loadedPatients || [];
      const enriched = appts.map((a) => {
        const doc = docs.find((d) => d.name === (a.doctorName || ""));
        const pat = pats.find((p) => p.name === (a.patientName || ""));
        return {
          ...a,
          doctorImage: a.doctorImage || (doc ? doc.image : undefined),
          patientImage: a.patientImage || (pat ? pat.profileImage : undefined),
        };
      });
      setAppointments(enriched);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "CheckedOut":
        return "bg-blue-100 text-blue-700";
      case "CheckedIn":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Scheduled":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 space-y-8">
        <Topbar />

        {/* Title + Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Appointment</h2>
          <button onClick={() => setShowModal(true)} className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            + New Appointment
          </button>
        </div>

        {/* White Card */}
        <div className="bg-white rounded-xl shadow p-6">
        {/* Top Controls */}
        <div className="flex flex-wrap justify-between gap-4 mb-6">
          {/* Search */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full md:w-1/3">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="ml-2 bg-transparent outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer">
            <Calendar className="text-blue-600 w-5 h-5" />
            <span className="text-gray-700">27 May 2025 – 02 Jun 2025</span>
          </div>

          {/* Export + Filter + Sort */}
          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
              Export
            </button>

            <button className="flex items-center border px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>

            <select className="border px-4 py-2 rounded-lg text-gray-600 bg-white">
              <option>Sort By: Recent</option>
              <option>Oldest</option>
              <option>Doctor</option>
              <option>Patient</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 table-auto">
            <thead>
              <tr className="border-b bg-gray-100 text-left text-gray-600">
                <th className="p-3">Date & Time</th>
                <th className="p-3">Patient</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-gray-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : (
                appointments
                  .filter((a) =>
                    a.patientName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((appt) => (
                    <tr key={appt._id} className="border-b hover:bg-gray-50 align-top">
                      <td className="p-3 align-top whitespace-nowrap" style={{width: '18%'}}>
                        {appt.date} — {appt.time}
                      </td>

                      {/* Patient */}
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-3">
                          <Avatar src={appt.patientImage} name={appt.patientName} size={40} className="border" />
                          <div>
                            <p className="font-medium">{appt.patientName}</p>
                            <p className="text-xs text-gray-500">{appt.patientPhone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="p-3 align-top">
                        <div className="flex items-center gap-3">
                          <Avatar src={appt.doctorImage} name={appt.doctorName} size={40} className="border" />
                          <div>
                            <p className="font-medium">{appt.doctorName}</p>
                            <p className="text-xs text-gray-500">{appt.specialization}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 align-top" style={{width: '12%'}}>{appt.mode}</td>

                      <td className="p-3 align-top" style={{width: '14%'}}>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                            appt.status
                          )}`}
                        >
                          {appt.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button className="text-gray-600 hover:text-gray-800">⋮</button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-500 text-sm">Show 10 Results</span>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">1</button>
            <button className="px-3 py-1 bg-blue-700 text-white rounded">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">...</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">12</button>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <NewAppointmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={async (payload) => {
            try {
              // lazy import to avoid circular issues
              const { createAppointment } = await import("../api/appointmentApi");
              await createAppointment(payload);
              await fetchAppointments();
              try { notify(); } catch (e) {}
              setShowModal(false);
            } catch (e) {
              console.error('Failed to save appointment', e);
              alert('Failed to save appointment');
            }
          }}
      />
    </main>
  </div>
  );
}
