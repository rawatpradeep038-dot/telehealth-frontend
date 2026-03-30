'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/send-otp', { phone });
      setGeneratedOtp(res.otp);
      setStep('otp');
    } catch (err: any) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', {
        phone,
        otp,
        fullName: 'User',
        role: 'patient',
      });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (res.user.role === 'patient') router.push('/dashboard/patient');
      else if (res.user.role === 'doctor') router.push('/dashboard/doctor');
      else router.push('/dashboard/admin');
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-gradient">MediConnect</span>
        </div>

        {step === 'phone' ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500 mb-8">Enter your phone number to sign in</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 flex items-center text-gray-500 text-sm">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border-gray-200 flex-1"
                    maxLength={10}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {generatedOtp && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                  <p className="text-teal-700 text-sm">Demo OTP: <strong>{generatedOtp}</strong></p>
                </div>
              )}

              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full gradient-primary text-white border-0 rounded-xl py-6"
              >
                {loading ? 'Sending...' : 'Send OTP'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => setStep('phone')}
              className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h1>
            <p className="text-gray-500 mb-8">
              We sent a code to <strong>+91 {phone}</strong>
            </p>

            {generatedOtp && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-4">
                <p className="text-teal-700 text-sm">Demo OTP: <strong>{generatedOtp}</strong></p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">6-digit OTP</label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="rounded-xl border-gray-200 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full gradient-primary text-white border-0 rounded-xl py-6"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/auth/register')}
            className="text-teal-600 font-medium hover:underline"
          >
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
}