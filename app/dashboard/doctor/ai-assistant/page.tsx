'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Stethoscope, Send, AlertTriangle, FlaskConical, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorAiAssistant() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/ai/doctor-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symptoms, patientHistory }),
      });

      if (!res.ok) throw new Error('Failed to analyze');
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
            onClick={() => router.push('/dashboard/doctor')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">AI Doctor Assistant</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-2 mb-6">
          <Stethoscope className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">
            AI suggestions are for reference only. All clinical decisions must be made by you as the doctor.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 space-y-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Patient Symptoms *
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. High fever 103°F, severe headache, body ache, fatigue for 3 days..."
              className="w-full h-28 border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Patient History (optional)
            </label>
            <textarea
              value={patientHistory}
              onChange={(e) => setPatientHistory(e.target.value)}
              placeholder="e.g. Diabetic, hypertensive, no known allergies, previously had typhoid in 2020..."
              className="w-full h-24 border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !symptoms.trim()}
            className="w-full gradient-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Get AI Suggestions
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
              {/* Possible Diagnosis */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <h3 className="font-semibold text-gray-900">Possible Diagnosis</h3>
                </div>
                <div className="space-y-2">
                  {result.diagnosis?.map((d: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-teal-500" />
                      {d}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Tests */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Suggested Tests</h3>
                </div>
                <div className="space-y-2">
                  {result.suggestedTests?.map((t: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Treatment Suggestion</h3>
                </div>
                <p className="text-sm text-gray-600">{result.treatment}</p>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">{result.disclaimer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}