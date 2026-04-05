'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, User, Phone, Calendar, Droplet, MapPin, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function PatientProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    emergency_contact: '',
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(savedUser);
    fetchProfile(savedUser.id);
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const data = await api.get(`/patient-profiles/user/${userId}`);
      setProfile(data);
      setForm({
        date_of_birth: data.date_of_birth?.split('T')[0] || '',
        gender: data.gender || '',
        blood_group: data.blood_group || '',
        address: data.address || '',
        emergency_contact: data.emergency_contact || '',
      });
    } catch {
      // no profile yet
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile) {
        await api.patch(`/patient-profiles/${profile.id}`, form);
      } else {
        await api.post('/patient-profiles', { user_id: user.id, ...form });
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

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
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
              {user?.full_name?.[0] || 'P'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-1">
            <Phone className="w-3 h-3" /> +91 {user?.phone}
          </p>
          <span className="mt-2 inline-block text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
            Patient
          </span>
        </motion.div>

        {/* Profile Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Health Information</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date of Birth
              </label>
              <Input type="date" value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                className="rounded-xl border-gray-200" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {genders.map((g) => (
                  <button key={g} onClick={() => setForm({ ...form, gender: g })}
                    className={`py-2 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.gender === g
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                <Droplet className="w-3 h-3" /> Blood Group
              </label>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((bg) => (
                  <button key={bg} onClick={() => setForm({ ...form, blood_group: bg })}
                    className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.blood_group === bg
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Address
              </label>
              <Input placeholder="Your address" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="rounded-xl border-gray-200" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1">
                <Phone className="w-3 h-3" /> Emergency Contact
              </label>
              <Input placeholder="Emergency contact number" value={form.emergency_contact}
                onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })}
                className="rounded-xl border-gray-200" />
            </div>

            <Button onClick={handleSave} disabled={saving}
              className="w-full gradient-primary text-white border-0 rounded-xl py-6 mt-2">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}