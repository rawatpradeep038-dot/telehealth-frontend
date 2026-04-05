'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, User, Phone, Calendar } from 'lucide-react';
import { api } from '@/lib/api';

export default function DoctorPatientsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await api.get(`/appointments/doctor/${user.id}`);
      // Get unique patients
      const seen = new Set();
      const unique = data.filter((apt: any) => {
        if (seen.has(apt.patient_id)) return false;
        seen.add(apt.patient_id);
        return true;
      });
      setAppointments(unique);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/doctor')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">My Patients</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Patients</h1>
          <p className="text-gray-500">Patients who have booked appointments with you</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading patients...</div>
        ) : appointments.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No patients yet</h3>
            <p className="text-gray-400 text-sm">Your patients will appear here once they book with you</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt, i) => (
              <motion.div key={apt.patient_id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">
                      {apt.patient?.full_name?.[0] || 'P'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {apt.patient?.full_name || 'Patient'}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      +91 {apt.patient?.phone}
                    </p>
                    <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Last visit: {new Date(apt.scheduled_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    apt.status === 'confirmed' ? 'bg-teal-50 text-teal-700' :
                    apt.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}