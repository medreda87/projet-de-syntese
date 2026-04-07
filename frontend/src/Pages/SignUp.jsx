import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft, ShieldCheck } from 'lucide-react';
import Button from '../Components/Button';
import { useAuth } from '../contexts/AuthContext';
import API from '../utils/api';

const SignUp = () => {
  const [step, setStep] = useState(1); // 1 = form, 2 = verification code
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Verification code state
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const from = location.state?.from || '/';

  // Countdown timer for step 2
  useEffect(() => {
    if (step !== 2 || countdown <= 0) {
      if (countdown <= 0) setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newDigits = [...codeDigits];
    newDigits[index] = value.slice(-1); // Take only last character
    setCodeDigits(newDigits);

    // Clear code error
    if (errors.code) {
      setErrors(prev => ({ ...prev, code: '' }));
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...codeDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setCodeDigits(newDigits);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      const res = await API.post('/send-verification-code', {
        email: formData.email,
      });

      if (res.data.success) {
        setStep(2);
        setCountdown(300);
        setCanResend(false);
        setCodeDigits(['', '', '', '', '', '']);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors;
        const mapped = {};
        if (serverErrors?.email) mapped.email = serverErrors.email[0];
        if (error.response.data.message && !serverErrors) {
          mapped.general = error.response.data.message;
        }
        setErrors(mapped);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to send verification code.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code and register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    
    const code = codeDigits.join('');
    if (code.length !== 6) {
      setErrors({ code: 'Please enter the full 6-digit code.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    const result = await register({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      code,
    });

    setIsLoading(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else if (result.errors) {
      const mapped = {};
      if (result.errors.name) mapped.general = result.errors.name[0];
      if (result.errors.email) mapped.general = result.errors.email[0];
      if (result.errors.code) mapped.code = result.errors.code[0];
      if (result.errors.password) mapped.general = result.errors.password[0];
      setErrors(mapped);
    } else {
      setErrors({ code: result.message || 'Verification failed.' });
    }
  };

  // Resend code
  const handleResendCode = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      await API.post('/send-verification-code', { email: formData.email });
      setCountdown(300);
      setCanResend(false);
      setCodeDigits(['', '', '', '', '', '']);
    } catch (error) {
      setErrors({ code: error.response?.data?.message || 'Failed to resend code.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-muted-foreground">Sign up to get started with FreshFold</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#0EA5C9]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-[#0EA5C9]" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Verify Your Email</h1>
              <p className="text-muted-foreground">
                We sent a 6-digit code to <br />
                <span className="font-medium text-[#1E2A36]">{formData.email}</span>
              </p>
            </>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          {step === 1 ? (
            /* ==================== STEP 1: Registration Form ==================== */
            <form onSubmit={handleSendCode} className="space-y-5">
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#1E2A36] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#62707D] w-5 h-5" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1E2A36] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#62707D] w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#1E2A36] mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#62707D] w-5 h-5" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1E2A36] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#62707D] w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#62707D] hover:text-[#1E2A36] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1E2A36] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#62707D] w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#62707D] hover:text-[#1E2A36] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-[#0EA5C9] border-gray-300 rounded focus:ring-[#0EA5C9]"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-[#62707D]">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#0EA5C9] hover:text-[#0d94b8]">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[#0EA5C9] hover:text-[#0d94b8]">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 rounded-lg mt-2"
                disabled={isLoading}
              >
                {isLoading ? 'Sending code...' : 'Continue'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#62707D]">Or sign up with</span>
                </div>
              </div>

              {/* Social Sign Up Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-[#1E2A36]">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium text-[#1E2A36]">Facebook</span>
                </button>
              </div>
            </form>
          ) : (
            /* ==================== STEP 2: Verification Code ==================== */
            <form onSubmit={handleVerifyAndRegister} className="space-y-6">
              {errors.code && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {errors.code}
                </div>
              )}

              {/* Code Inputs */}
              <div className="flex justify-center gap-3" onPaste={handleCodePaste}>
                {codeDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(idx, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0EA5C9] focus:border-[#0EA5C9] transition-all border-gray-200"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-[#62707D]">
                    Code expires in{' '}
                    <span className="font-semibold text-[#0EA5C9]">{formatTime(countdown)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-red-500 font-medium">Code expired</p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 rounded-lg"
                disabled={isLoading || codeDigits.join('').length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </Button>

              {/* Resend / Back */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep(1); setErrors({}); }}
                  className="flex items-center gap-1 text-[#62707D] hover:text-[#1E2A36] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || isLoading}
                  className={`font-medium transition-colors ${
                    canResend
                      ? 'text-[#0EA5C9] hover:text-[#0d94b8] cursor-pointer'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-[#62707D]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#0EA5C9] hover:text-[#0d94b8] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
