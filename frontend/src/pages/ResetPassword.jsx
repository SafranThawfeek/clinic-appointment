import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword as apiReset } from '../api/resetApi';

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await apiReset({ token, password: form.password, confirmPassword: form.confirmPassword });
      alert('Password reset successful. Please login.');
      nav('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
          <h2 className="text-center text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-center text-gray-500 mb-6">Your new password must be different from previous used passwords.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="password" type="password" placeholder="New password" value={form.password} onChange={handleChange}
              className="w-full p-3 border rounded" required />
            <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange}
              className="w-full p-3 border rounded" required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full bg-blue-700 text-white py-3 rounded" disabled={loading}>{loading ? 'Saving...' : 'Reset Password'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
