import React, { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getDoctors, deleteDoctor } from "../api/doctorApi";
import { useSync } from "../context/SyncContext";
import AddDoctorModal from "../components/AddDoctorModal";
import EditDoctorModal from "../components/EditDoctorModal";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const { searchQuery } = useSearch();
  const { notify } = useSync();

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDoctors(doctors);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = doctors.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.specialization || "").toLowerCase().includes(q)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  async function loadDoctors() {
    try {
      const res = await getDoctors();
      setDoctors(res.data);
      setFilteredDoctors(res.data);
      // notify global sync so dashboard and other pages can refresh
      try { notify(); } catch (e) {}
    } catch (err) {
      console.error(err);
    }
  }

  // Note: local search removed. Topbar search is used for global searching.

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(id);
        loadDoctors();
      } catch (err) {
        console.error(err);
      }
    }
  }

  function handleEdit(doc) {
    setSelectedDoctor(doc);
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
          <h1 className="text-2xl font-semibold text-gray-800">Doctor Grid</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            + New Doctor
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Total Doctors:{" "}
            <span className="font-semibold text-gray-800">{filteredDoctors.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition border border-gray-100"
            >
              <div className="flex flex-col items-center p-6">
                <img
                  src={`http://localhost:5000${doc.image}`}
                  alt={doc.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  Dr. {doc.name}
                </h3>
                <p className="text-blue-600 text-sm mb-2">{doc.specialization}</p>
                <div className="flex justify-between w-full border-t pt-3 mt-3 text-sm">
                  <button onClick={() => handleEdit(doc)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(doc._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AddDoctorModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={loadDoctors} />
        <EditDoctorModal isOpen={showEditModal} doctorData={selectedDoctor} onClose={() => setShowEditModal(false)} onSuccess={loadDoctors} />
      </main>
    </div>
  );
}
