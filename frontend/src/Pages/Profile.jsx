import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Save, ArrowLeft, ShieldCheck } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) { setError('Name cannot be empty.'); return; }

    if (changingPassword) {
      if (!currentPassword) { setError('Please enter your current password.'); return; }
      if (!newPassword || newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
      if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    }

    setIsSaving(true);
    try {
      const payload = { name };
      if (changingPassword) {
        payload.current_password = currentPassword;
        payload.password = newPassword;
        payload.password_confirmation = confirmPassword;
      }

      const res = await API.put('/profile', payload);
      const updatedUser = res.data.user;

      // Update localStorage
      const stored = JSON.parse(localStorage.getItem('userFreshFold') || '{}');
      localStorage.setItem('userFreshFold', JSON.stringify({ ...stored, ...updatedUser }));

      setSuccess('Profile updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <main className="bg-background py-16 px-4">
      <div className="w-full max-w-lg mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft size={14} /> Back to home
        </Link>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 28, fontWeight: 800, color: '#fff' }}>
            {initial}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span style={{ marginTop: 8, padding: '3px 12px', borderRadius: 99, background: user?.role === 'provider' ? '#eff6ff' : '#f0fdf4', color: user?.role === 'provider' ? '#3b82f6' : '#22c55e', fontSize: 12, fontWeight: 600 }}>
            {user?.role === 'provider' ? 'Provider' : 'Customer'}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Edit Profile</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">{success}</div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
            </div>

            {/* Change password toggle */}
            <div>
              <button
                type="button"
                onClick={() => { setChangingPassword(!changingPassword); setError(''); }}
                className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600"
              >
                <ShieldCheck size={16} />
                {changingPassword ? 'Cancel password change' : 'Change password'}
              </button>
            </div>

            {changingPassword && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => { setCurrentPassword(e.target.value); setError(''); }}
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', opacity: isSaving ? 0.7 : 1 }}
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="mt-6 bg-white rounded-2xl border border-red-100 p-6">
          <h3 className="text-sm font-semibold text-red-500 mb-3">Account</h3>
          <button
            onClick={() => logout()}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Logout from this device
          </button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
