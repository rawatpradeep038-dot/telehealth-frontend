'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, FileText, Calendar, User } from 'lucide-react';
import { api } from '@/lib/api';

export default function PrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await api.get(`/prescriptions/patient/${user.id}`);
      setPrescriptions(data);
    } catch {
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/patient')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">My Prescriptions</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Prescriptions</h1>
          <p className="text-gray-500">Your digital prescriptions from doctors</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No prescriptions yet</h3>
            <p className="text-gray-400 text-sm">Your prescriptions will appear here after a consultation</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription, i) => (
              <motion.div key={prescription.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Prescription</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Dr. {prescription.doctor?.full_name}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    prescription.status === 'active'
                      ? 'bg-teal-50 text-teal-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {prescription.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Medications</p>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(prescription.medications, null, 2)}
                  </pre>
                </div>

                {prescription.instructions && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instructions: </span>
                    {prescription.instructions}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Issued: {new Date(prescription.issued_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
