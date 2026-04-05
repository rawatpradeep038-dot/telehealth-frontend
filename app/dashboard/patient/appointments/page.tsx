'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Search, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [booking, setBooking] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await api.get('/doctor-profiles');
      setDoctors(data);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (doctorUserId: string) => {
    setBooking(doctorUserId);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 1);
      scheduledAt.setHours(10, 0, 0, 0);

      await api.post('/appointments', {
        patient_id: user.id,
        doctor_id: doctorUserId,
        scheduled_at: scheduledAt.toISOString(),
        type: 'online',
      });
      setSuccess('Appointment booked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      alert('Failed to book appointment. Please try again.');
    } finally {
      setBooking(null);
    }
  };

  const filtered = doctors.filter(d =>
    d.user?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty?.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="text-xl font-semibold text-gradient">Book Appointment</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 text-teal-700 font-medium"
          >
            ✅ {success}
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
          <p className="text-gray-500 mb-4">Browse our verified doctors and book instantly</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
          </div>
        </motion.div>

        {/* Doctors List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-12 text-center"
          >
            <div className="text-5xl mb-4">👨‍⚕️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No doctors available yet</h3>
            <p className="text-gray-400 text-sm">Doctors will appear here once they register and get approved</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">
                      {doctor.user?.full_name?.[0] || 'D'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Dr. {doctor.user?.full_name}</h3>
                    <p className="text-teal-600 text-sm font-medium">{doctor.specialty}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {doctor.experience_years || 0} yrs exp
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" /> 5.0
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> ₹{doctor.consultation_fee || 500}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleBook(doctor.user_id)}
                  disabled={booking === doctor.user_id}
                  className="w-full mt-4 gradient-primary text-white border-0 rounded-xl"
                >
                  {booking === doctor.user_id ? 'Booking...' : 'Book Appointment'}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}