import React, { useState } from "react";
import { createPatient } from "../api/patientApi";

export default function AddPatientModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    address1: "",
    address2: "",
    country: "",
    city: "",
    state: "",
    pincode: "",
    status: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setForm({ ...form, profileImage: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', `${form.firstName} ${form.lastName}`.trim());
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('dob', form.dob);
      formData.append('gender', form.gender);
      formData.append('bloodGroup', form.bloodGroup);
      formData.append('address1', form.address1);
      formData.append('address2', form.address2);
      formData.append('country', form.country);
      formData.append('city', form.city);
      formData.append('state', form.state);
      formData.append('pincode', form.pincode);
      formData.append('primaryDoctor', form.primaryDoctor);
      formData.append('status', form.status);
      
      // Add image if selected
      if (form.profileImage) {
        formData.append('profileImage', form.profileImage);
      }
      
      await createPatient(formData);
      alert("Patient added successfully!");
      onSuccess();
      onClose();
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        address1: "",
        address2: "",
        country: "",
        city: "",
        state: "",
        pincode: "",
        status: "",
        primaryDoctor: "",
        profileImage: null,
      });
      setPreview(null);
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Error adding patient: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto py-8">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-2xl font-light"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-6 text-gray-800">Add New Patient</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Patient Information
            </h3>

            {/* Profile Image */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <input
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="text-xs border border-gray-300 rounded px-3 py-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  First Name *
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>

            {/* DOB and Gender */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Primary Doctor *
                </label>
                <select
                  name="primaryDoctor"
                  value={form.primaryDoctor || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select</option>
                  <option>Dr. Smith</option>
                  <option>Dr. Johnson</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  DOB *
                </label>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
            </div>

            {/* Gender and Blood Group */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                required
              >
                <option value="">Select</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </section>

          {/* Address Information Section */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Address Information
            </h3>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address 1
              </label>
              <input
                name="address1"
                value={form.address1}
                onChange={handleChange}
                placeholder="Street Address"
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address 2
              </label>
              <input
                name="address2"
                value={form.address2}
                onChange={handleChange}
                placeholder="Apartment, suite, etc."
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>UK</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  City
                </label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  State
                </label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select</option>
                  <option>NY</option>
                  <option>CA</option>
                  <option>TX</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Pincode
                </label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add New Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
