import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, FileText, Clock, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const BecomeProviderModal = ({ onClose }) => {
  const { user, updateRole } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    openingHours: '',
  });

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      setError('Laundry name and address are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('address', form.address);
      data.append('phone', form.phone);
      data.append('description', form.description);
      data.append('openingHours', form.openingHours);
      data.append('user_id', user.id);
      await API.post('/laundries', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      await updateRole('provider');
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const goToDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 text-center" style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)' }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
            <X size={16} />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-black text-white">Set up your laundry</h2>
          <p className="text-white/80 text-sm mt-1">Fill in your laundry details to become a provider</p>
        </div>

        {step === 'success' ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-black text-[#0F172A] mb-2">You're now a provider! 🎉</h3>
            <p className="text-sm text-[#64748B] mb-6">
              Your laundry has been submitted for review. You can manage it from your dashboard once approved.
            </p>
            <button onClick={goToDashboard}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)' }}>
              Go to my dashboard
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                <span className="flex items-center gap-2"><Building2 size={14} /> Laundry name <span className="text-red-500">*</span></span>
              </label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. FreshClean Laundry"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                <span className="flex items-center gap-2"><MapPin size={14} /> Address <span className="text-red-500">*</span></span>
              </label>
              <input name="address" value={form.address} onChange={handleChange} required placeholder="123 Main Street, City"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                <span className="flex items-center gap-2"><Phone size={14} /> Phone number</span>
              </label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                <span className="flex items-center gap-2"><FileText size={14} /> Description</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Describe your laundry services…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                <span className="flex items-center gap-2"><Clock size={14} /> Opening hours</span>
              </label>
              <textarea name="openingHours" value={form.openingHours} onChange={handleChange} rows={2}
                placeholder="e.g. Mon–Fri: 8:00–20:00, Sat: 9:00–18:00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0C8CE9] focus:ring-2 focus:ring-[#0C8CE9]/10 resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#374151] hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#0C8CE9,#06D6A0)', opacity: submitting ? 0.7 : 1 }}>
                <Save size={15} /> {submitting ? 'Submitting…' : 'Create my laundry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BecomeProviderModal;
