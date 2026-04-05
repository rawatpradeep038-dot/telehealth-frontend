'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, UserCheck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function ApproveDoctorsPage() {
  const router = useRouter();
  const [pending, setPending] = useState<any[]>([]);
  const [approved, setApproved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const [pendingData, approvedData] = await Promise.all([
        api.get('/doctor-profiles/pending'),
        api.get('/doctor-profiles'),
      ]);
      setPending(pendingData);
      setApproved(approvedData);
    } catch {
      setPending([]);
      setApproved([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      await api.patch(`/doctor-profiles/${id}/approve`, {});
      fetchDoctors();
    } catch {
      alert('Failed to approve doctor');
    } finally {
      setApproving(null);
    }
  };

  const DoctorCard = ({ doctor, showApprove }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-5"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">
            {doctor.user?.full_name?.[0] || 'D'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{doctor.user?.full_name}</h3>
          <p className="text-teal-600 text-sm font-medium">{doctor.specialty}</p>
          <p className="text-gray-400 text-xs mt-1">
            License: {doctor.license_number} · {doctor.experience_years} yrs exp
          </p>
        </div>
        {showApprove ? (
          <Button onClick={() => handleApprove(doctor.id)}
            disabled={approving === doctor.id}
            className="gradient-primary text-white border-0 rounded-xl text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            {approving === doctor.id ? 'Approving...' : 'Approve'}
          </Button>
        ) : (
          <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/admin')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">Manage Doctors</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Pending */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Pending Approval ({pending.length})
                </h2>
              </div>
              {pending.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                  No pending applications
                </div>
              ) : (
                <div className="space-y-4">
                  {pending.map((doc) => (
                    <DoctorCard key={doc.id} doctor={doc} showApprove={true} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Approved */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-teal-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Approved Doctors ({approved.length})
                </h2>
              </div>
              {approved.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                  No approved doctors yet
                </div>
              ) : (
                <div className="space-y-4">
                  {approved.map((doc) => (
                    <DoctorCard key={doc.id} doctor={doc} showApprove={false} />
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}