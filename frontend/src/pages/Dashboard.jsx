import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import AppointmentChart from "../components/AppointmentChart";
import DoctorCard from "../components/DoctorCard";
import AppointmentTable from "../components/AppointmentTable";
import CalendarAppointments from "../components/CalendarAppointments";
import { getDoctors } from "../api/doctorApi";
import { getPatients } from "../api/patientApi";
import { getAppointments } from "../api/appointmentApi";
import { useSync } from "../context/SyncContext";

export default function Dashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);

  const { tick } = useSync();

  useEffect(() => {
    async function loadStats() {
      try {
        const [docRes, patRes, apptRes] = await Promise.all([
          getDoctors(),
          getPatients(),
          getAppointments(),
        ]);

        const docs = Array.isArray(docRes.data) ? docRes.data : (docRes.data || []);
        const pats = Array.isArray(patRes.data) ? patRes.data : (patRes.data || []);
        const appts = Array.isArray(apptRes.data) ? apptRes.data : (apptRes.data || []);

        setStats({
          doctors: docs.length,
          patients: pats.length,
          appointments: appts.length,
        });

        // enrich appointments with doctor/patient images when available
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
        setDoctorsList(docs);

        // compute top doctors by counting appointments per doctorName
        const counts = {};
        appts.forEach((a) => {
          const name = a.doctorName || "Unknown";
          counts[name] = (counts[name] || 0) + 1;
        });

        const top = Object.entries(counts)
          .map(([name, count]) => {
            const doc = docs.find((d) => d.name === name) || {};
            return { name, count, image: doc.image, department: doc.department };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setTopDoctors(top);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      }
    }
    loadStats();
  }, [tick]);

  // derive appointment counts for the small summary pills
  const totalAppts = appointments.length;
  const cancelled = appointments.filter((a) => (a.status || '').toLowerCase() === 'cancelled').length;
  const rescheduled = appointments.filter((a) => (a.status || '').toLowerCase() === 'rescheduled' || (a.status || '').toLowerCase() === 'reschedule').length;
  const completed = appointments.filter((a) => (a.status || '').toLowerCase() === 'completed' || (a.status || '').toLowerCase() === 'confirmed').length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 space-y-8">
        {/* Topbar */}
        <Topbar />

        {/* ======== Statistics Row ======== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatCard title="Total Doctors" value={stats.doctors} percent={12} color="text-green-500" />
          <StatCard title="Patients" value={stats.patients} percent={8} color="text-green-500" />
          <StatCard title="Appointments" value={stats.appointments} percent={-5} color="text-red-500" />
        </section>

        {/* ======== Chart + Calendar Section ======== */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Appointment Chart + summary pills */}
          <div className="xl:col-span-2">
            <div className="bg-white p-5 rounded-2xl shadow mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Appointment Statistics</h3>
                <div className="flex items-center gap-3">
                  <select className="border px-3 py-1 rounded text-sm text-gray-600">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">All Appointments</span>
                  <span className="text-lg font-bold text-gray-800">{totalAppts}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">Cancelled</span>
                  <span className="text-lg font-bold text-red-600">{cancelled}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">Rescheduled</span>
                  <span className="text-lg font-bold text-yellow-600">{rescheduled}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg flex flex-col">
                  <span className="text-sm text-gray-500">Completed</span>
                  <span className="text-lg font-bold text-green-600">{completed}</span>
                </div>
              </div>

              <div className="mt-4">
                <AppointmentChart appointments={appointments} />
              </div>
            </div>
          </div>

          {/* Right: Calendar + Appointments */}
          <div className="xl:col-span-1">
            <CalendarAppointments appointments={appointments} />
          </div>
        </section>

        {/* ======== Popular Doctors + Appointments Table ======== */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Popular Doctors */}
          <div className="bg-white rounded-2xl shadow p-6 xl:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Popular Doctors</h3>
            <div className="space-y-4">
              {topDoctors.length === 0 && <div className="text-gray-400">No doctors yet</div>}
              {topDoctors.map((d) => (
                <DoctorCard key={d.name} name={d.name} specialty={d.department || d.designation || "General"} patients={`${d.count || 0} patients`} img={d.image} />
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl shadow p-6 xl:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">All Appointments</h3>
            <AppointmentTable list={appointments.slice(0, 10)} total={appointments.length} onView={() => {}} onEdit={() => {}} onDelete={() => {}} showActions={false} />
          </div>
        </section>
      </main>
    </div>
  );
}
