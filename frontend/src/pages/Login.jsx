import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      if (form.remember) {
        localStorage.setItem('rememberedEmail', form.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      nav('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Image Section */}
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

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">Sign In</h2>
          <p className="text-center text-gray-500 mb-6">
            Please enter below details to access the dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                className="w-full mt-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full mt-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Remember Me
              </label>
              <a
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            OR
            <p className="mt-2">
              Don’t have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </div>

          <p className="mt-6 text-gray-400 text-xs text-center">
            © 2025 Clinic Appointment System
          </p>
        </div>
      </div>
    </div>
  );
}
