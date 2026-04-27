'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

declare global {
  interface Window { Razorpay: any; }
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [amount, setAmount] = useState(500);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = await api.post('/payments/create-order', {
        amount,
        appointmentId,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'MediConnect',
        description: 'Consultation Fee',
        order_id: order.orderId,
        handler: async (response: any) => {
          const verify = await api.post('/payments/verify', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verify.success) {
            setPaid(true);
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user') || '{}')?.full_name,
        },
        theme: { color: '#0d9488' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Your consultation fee has been paid. You can now join the video call.</p>
          <button
            onClick={() => router.push(`/dashboard/video/${appointmentId}`)}
            className="w-full gradient-primary text-white py-3 rounded-xl font-medium"
          >
            Join Video Call
          </button>
          <button
            onClick={() => router.push('/dashboard/patient')}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">Payment</span>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Consultation Fee</span>
              <span className="font-medium">₹{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platform Fee</span>
              <span className="font-medium text-teal-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">₹{amount}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Secure Payment</h2>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Powered by Razorpay. Pay using UPI, Cards, Net Banking or Wallets.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['UPI', 'Visa', 'Mastercard', 'NetBanking', 'Wallets'].map(m => (
              <span key={m} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {m}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full gradient-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            🔒 256-bit SSL encrypted payment
          </p>
        </motion.div>
      </div>
    </div>
  );
}