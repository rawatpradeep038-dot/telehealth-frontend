'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, Phone, Save, Star, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function DoctorProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    specialty: '',
    license_number: '',
    experience_years: '',
    consultation_fee: '',
    bio: '',
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(savedUser);
    fetchProfile(savedUser.id);
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const data = await api.get(`/doctor-profiles/user/${userId}`);
      setProfile(data);
      setForm({
        specialty: data.specialty || '',
        license_number: data.license_number || '',
        experience_years: data.experience_years?.toString() || '',
        consultation_fee: data.consultation_fee?.toString() || '',
        bio: data.bio || '',
      });
    } catch {
      // no profile yet
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile) {
        await api.patch(`/doctor-profiles/${profile.id}`, {
          ...form,
          experience_years: parseInt(form.experience_years) || 0,
          consultation_fee: parseFloat(form.consultation_fee) || 0,
        });
      } else {
        await api.post('/doctor-profiles', {
          user_id: user.id,
          ...form,
          experience_years: parseInt(form.experience_years) || 0,
          consultation_fee: parseFloat(form.consultation_fee) || 0,
        });
      }
      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchProfile(user.id);
    } catch {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const specialties = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'General Physician', 'Psychiatrist', 'ENT Specialist'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/doctor')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">My Profile</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6 text-teal-700 font-medium">
            ✅ {success}
          </motion.div>
        )}

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">
              {user?.full_name?.[0] || 'D'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Dr. {user?.full_name}</h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
            <Phone className="w-3 h-3" /> +91 {user?.phone}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Doctor</span>
            {profile?.is_approved && (
              <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Professional Information</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Specialty</label>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((s) => (
                  <button key={s} onClick={() => setForm({ ...form, specialty: s })}
                    className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                      form.specialty === s
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">License Number</label>
              <Input placeholder="e.g. MED123456" value={form.license_number}
                onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                className="rounded-xl border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Experience (years)
                </label>
                <Input type="number" placeholder="e.g. 5" value={form.experience_years}
                  onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                  className="rounded-xl border-gray-200" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Consultation Fee (₹)
                </label>
                <Input type="number" placeholder="e.g. 500" value={form.consultation_fee}
                  onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })}
                  className="rounded-xl border-gray-200" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
              <textarea placeholder="Tell patients about yourself..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>

            <Button onClick={handleSave} disabled={saving}
              className="w-full gradient-primary text-white border-0 rounded-xl py-6">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}