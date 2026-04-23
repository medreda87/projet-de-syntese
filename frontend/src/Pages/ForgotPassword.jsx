import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import API from '../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=code+new password
  const [email, setEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await API.post('/forgot-password', { email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const digits = [...codeDigits];
    digits[index] = value.slice(-1);
    setCodeDigits(digits);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const code = codeDigits.join('');
    if (code.length !== 6) { setError('Please enter the 6-digit code.'); return; }
    if (!newPassword || newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await API.post('/reset-password', {
        email,
        code,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8">
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col items-center mb-8">
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              {step === 1 ? <Mail size={24} color="#fff" /> : <ShieldCheck size={24} color="#fff" />}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {step === 1 ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="text-sm text-gray-500 text-center">
              {step === 1
                ? 'Enter your email and we\'ll send you a reset code.'
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
              {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              {/* OTP code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Verification code</label>
                <div className="flex gap-2 justify-center">
                  {codeDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(i, e.target.value)}
                      onKeyDown={e => handleCodeKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                    />
                  ))}
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #0C8CE9, #06D6A0)', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button type="button" onClick={() => { setStep(1); setError(''); setCodeDigits(['','','','','','']); }} className="w-full text-sm text-gray-500 hover:text-gray-700 py-2">
                ← Try a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
