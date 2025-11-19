import React, { useState } from "react";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Password reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
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

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">
            Forgot Password
          </h2>
          <p className="text-center text-gray-500 mb-6">
            No worries, we’ll send you reset instructions
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            {message && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-600 hover:underline text-sm">
              Return to Login
            </a>
          </div>

          <p className="mt-6 text-gray-400 text-xs text-center">
            © 2025 Clinic Appointment System
          </p>
        </div>
      </div>
    </div>
  );
}
