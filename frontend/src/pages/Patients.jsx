import React, { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getPatients, deletePatient } from "../api/patientApi";
import AddPatientModal from "../components/AddPatientModal";
import EditPatientModal from "../components/EditPatientModal";
import { useSync } from "../context/SyncContext";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const { notify } = useSync();

  const { searchQuery } = useSearch();

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPatients(patients);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q) ||
        (p.phone || "").toLowerCase().includes(q)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  async function loadPatients() {
    try {
      const res = await getPatients();
      setPatients(res.data);
      setFilteredPatients(res.data);
      try { notify(); } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(id);
        loadPatients();
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleEdit(patient) {
    setSelectedPatient(patient);
    setShowEditModal(true);
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Topbar />

        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Patient Grid</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            + New Patient
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Total Patients:{" "}
            <span className="font-semibold text-gray-800">{filteredPatients.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition border border-gray-100"
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden border-2 border-blue-200">
                  {patient.profileImage ? (
                    <img 
                      src={`http://localhost:5000${patient.profileImage}`} 
                      alt={patient.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!patient.profileImage && (
                    <span>{patient.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {patient.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{patient.email}</p>
                <p className="text-gray-500 text-xs mb-3">{patient.phone || "N/A"}</p>
                <p className="text-gray-400 text-xs mb-4">
                  Registered: {new Date(patient.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between w-full border-t pt-3 mt-3 text-sm">
                  <button onClick={() => handleEdit(patient)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(patient._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No patients found</p>
          </div>
        )}

        <AddPatientModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={loadPatients} />
        <EditPatientModal isOpen={showEditModal} patientData={selectedPatient} onClose={() => setShowEditModal(false)} onSuccess={loadPatients} />
      </main>
    </div>
  );
}
