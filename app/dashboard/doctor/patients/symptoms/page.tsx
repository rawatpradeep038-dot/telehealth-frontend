'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Send, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SymptomChecker() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const urgencyConfig: any = {
    low: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: 'Low Urgency — Can wait a few days' },
    medium: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Clock className="w-5 h-5 text-amber-600" />, label: 'Medium Urgency — See a doctor within 24 hours' },
    high: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <AlertTriangle className="w-5 h-5 text-red-600" />, label: 'High Urgency — Seek immediate care!' },
  };

  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/ai/symptom-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!res.ok) throw new Error('Failed to analyze symptoms');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/patient')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">AI Symptom Checker</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6"
        >
          <p className="text-gray-500 text-sm mb-4">
            Describe your symptoms in detail. The AI will suggest possible conditions and urgency level.
          </p>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. I have a headache, fever of 101°F, and sore throat since 2 days..."
            className="w-full h-32 border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleCheck}
            disabled={loading || !symptoms.trim()}
            className="mt-4 w-full gradient-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Analyzing symptoms...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Check Symptoms
              </>
            )}
          </button>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
            {error}
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Urgency */}
              <div className={`rounded-2xl border p-4 flex items-center gap-3 ${urgencyConfig[result.urgency]?.bg} ${urgencyConfig[result.urgency]?.border}`}>
                {urgencyConfig[result.urgency]?.icon}
                <span className={`font-semibold text-sm ${urgencyConfig[result.urgency]?.color}`}>
                  {urgencyConfig[result.urgency]?.label}
                </span>
              </div>

              {/* Possible Conditions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Possible Conditions</h3>
                <div className="space-y-2">
                  {result.conditions?.map((condition: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-teal-500" />
                      {condition}
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Advice</h3>
                <p className="text-sm text-gray-600">{result.advice}</p>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">{result.disclaimer}</p>
              </div>

              {/* Book Appointment Button */}
              <button
                onClick={() => router.push('/dashboard/patient/appointments')}
                className="w-full gradient-primary text-white py-3 rounded-xl font-medium"
              >
                Book a Doctor Appointment
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}