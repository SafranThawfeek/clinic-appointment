import React, { useState } from "react";
import { createDoctor } from "../api/doctorApi";

export default function AddDoctorModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    dob: "",
    experience: "",
    department: "",
    designation: "",
    license: "",
    language: "",
    bloodGroup: "",
    gender: "",
    bio: "",
    address1: "",
    address2: "",
    country: "",
    city: "",
    state: "",
    pincode: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDoctor(form);
      alert("Doctor added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error adding doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-800">New Doctor</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <section>
            <h3 className="text-gray-700 font-semibold mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Profile Image */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <label className="block text-gray-600 text-sm mb-2">
                  Profile Image
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-24 h-24 mt-2 rounded-full object-cover border"
                  />
                )}
              </div>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name *"
                className="p-3 border rounded-lg"
                required
              />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username *"
                className="p-3 border rounded-lg"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                className="p-3 border rounded-lg"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email *"
                className="p-3 border rounded-lg"
                required
              />
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                placeholder="DOB"
                className="p-3 border rounded-lg"
              />
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Years of Experience"
                className="p-3 border rounded-lg"
              />
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Department"
                className="p-3 border rounded-lg"
              />
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="p-3 border rounded-lg"
              />
              <input
                name="license"
                value={form.license}
                onChange={handleChange}
                placeholder="Medical License Number"
                className="p-3 border rounded-lg"
              />
              <input
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="Languages Spoken"
                className="p-3 border rounded-lg"
              />
              <input
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                placeholder="Blood Group"
                className="p-3 border rounded-lg"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="p-3 border rounded-lg"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="About Doctor"
                className="p-3 border rounded-lg col-span-3"
              />
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h3 className="text-gray-700 font-semibold mb-3">
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                name="address1"
                value={form.address1}
                onChange={handleChange}
                placeholder="Address 1"
                className="p-3 border rounded-lg"
              />
              <input
                name="address2"
                value={form.address2}
                onChange={handleChange}
                placeholder="Address 2"
                className="p-3 border rounded-lg"
              />
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="p-3 border rounded-lg"
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="p-3 border rounded-lg"
              />
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className="p-3 border rounded-lg"
              />
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="p-3 border rounded-lg"
              />
            </div>
          </section>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              {loading ? "Saving..." : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
