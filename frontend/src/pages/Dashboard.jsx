import React, { useEffect, useState } from 'react';
import { getDoctors } from '../api/doctorApi';
import { getPatients } from '../api/patientApi';
import { getAppointments } from '../api/appointmentApi';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [docRes, patRes, appRes] = await Promise.all([
        getDoctors(),
        getPatients(),
        getAppointments()
      ]);
      setDoctors(docRes.data);
      setPatients(patRes.data);
      setAppointments(appRes.data);
    }
    loadData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-gray-500 text-sm">Doctors</h3>
            <p className="text-3xl font-bold">{doctors.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-gray-500 text-sm">Patients</h3>
            <p className="text-3xl font-bold">{patients.length}</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-gray-500 text-sm">Appointments</h3>
            <p className="text-3xl font-bold">{appointments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
