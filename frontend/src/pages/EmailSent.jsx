import React from "react";
import { useNavigate } from "react-router-dom";
// Inline SVG used instead of @heroicons to avoid adding a dependency

export default function EmailSent() {
  const nav = useNavigate();

  const handleClick = () => {
    nav("/reset-password"); // navigate to reset page (you will create this next)
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left doctor image */}
      <div className="hidden md:block w-1/2 bg-blue-900">
        <div className="h-screen p-8 flex items-center justify-center">
          <div className="w-full h-[86vh] rounded-xl overflow-hidden border-8 border-blue-600 shadow-lg">
            <img
              src="/images/doctor-left.png"
              alt="doctor"
              className="w-full h-full object-cover block"
            />
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow text-center">
          <div className="flex justify-center mb-4">
            <svg className="h-14 w-14 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Email Sent!</h2>
          <p className="text-gray-500 mb-6">
            Check your email and change your password.
          </p>

          <button
            onClick={handleClick}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition"
          >
            Reset Password
          </button>

          <p className="mt-6 text-gray-400 text-xs text-center">
            © 2025 Clinic Appointment System
          </p>
        </div>
      </div>
    </div>
  );
}
