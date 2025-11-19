import React, { useState } from 'react';
import { register as apiRegister } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', agree:false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type==='checkbox' ? checked : value }));
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.agree) return setError('Please agree to Terms');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await apiRegister(form);
      alert('Registration successful. Please login.');
      nav('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex">
      {/* left image */}
      <div className="hidden md:block w-1/2 bg-blue-800">
        <div className="h-screen p-8 flex items-center justify-center">
          <div className="w-full h-[86vh] rounded-xl overflow-hidden border-8 border-blue-600 shadow-lg">
            <img src="/images/doctor-left.png" alt="doctor" className="w-full h-full object-cover block" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">Register</h2>
          <p className="text-center text-gray-500 mb-6">Please enter your details to create account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name"
              className="w-full p-3 border rounded" required />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email"
              className="w-full p-3 border rounded" required />
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password"
              className="w-full p-3 border rounded" required />
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password"
              className="w-full p-3 border rounded" required />
            <div className="flex items-center gap-2">
              <input name="agree" type="checkbox" checked={form.agree} onChange={handleChange} />
              <span className="text-sm text-gray-600">I agree to <a href="/terms" className="text-blue-600">Terms  of Service & Privacy Policy</a></span>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button disabled={loading} className="w-full bg-blue-700 text-white py-3 rounded">{ loading ? 'Registering...' : 'Register' }</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
        </div>
      </div>
    </div>
  );
}
