'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Calendar, User, Clock, CheckCircle, XCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await api.get(`/appointments/doctor/${user.id}`);
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleJoinCall = (appointmentId: string) => {
    router.push(`/dashboard/video/${appointmentId}`);
  };

  const statusColor: any = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-teal-50 text-teal-700',
    completed: 'bg-blue-50 text-blue-700',
    cancelled: 'bg-red-50 text-red-700',
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
            <span className="text-xl font-semibold text-gradient">My Appointments</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Appointments</h1>
          <p className="text-gray-500">Manage your patient appointments</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No appointments yet</h3>
            <p className="text-gray-400 text-sm">Patients will appear here once they book with you</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt, i) => (
              <motion.div key={apt.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {apt.patient?.full_name || 'Patient'}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(apt.scheduled_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>

                {apt.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button onClick={() => handleStatus(apt.id, 'confirmed')}
                      className="flex-1 gradient-primary text-white border-0 rounded-xl">
                      <CheckCircle className="w-4 h-4 mr-2" /> Confirm
                    </Button>
                    <Button onClick={() => handleStatus(apt.id, 'cancelled')}
                      variant="outline" className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                  </div>
                )}

                {apt.status === 'confirmed' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleJoinCall(apt.id)}
                      className="flex-1 gradient-primary text-white border-0 rounded-xl flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" /> Join Video Call
                    </Button>
                    <Button
                      onClick={() => router.push(`/dashboard/doctor/prescriptions?patientId=${apt.patient_id}&appointmentId=${apt.id}`)}
                      variant="outline" className="flex-1 rounded-xl">
                      Write Prescription
                    </Button>
                    <Button onClick={() => handleStatus(apt.id, 'completed')}
                      variant="outline" className="rounded-xl border-teal-200 text-teal-600 hover:bg-teal-50">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}