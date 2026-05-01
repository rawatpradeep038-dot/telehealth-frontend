'use client';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

function WritePrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || '';
  const appointmentId = searchParams.get('appointmentId') || '';

  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ]);
  const [instructions, setInstructions] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!patientId || !appointmentId) {
      alert('Missing patient or appointment info. Go back and try again.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/prescriptions', {
        appointment_id: appointmentId,
        doctor_id: user.id,
        patient_id: patientId,
        medications,
        instructions,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/doctor/appointments'), 2000);
    } catch {
      alert('Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center shadow-xl">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prescription Saved!</h2>
          <p className="text-gray-500">Redirecting to appointments...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => router.push('/dashboard/doctor/appointments')}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">Write Prescription</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">New Prescription</h1>
          <p className="text-gray-500">Add medications and instructions for your patient</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Medications</h3>
            <Button onClick={addMedication} variant="outline"
              className="rounded-xl text-sm border-teal-200 text-teal-600 hover:bg-teal-50">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <div className="space-y-4">
            {medications.map((med, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Medicine {i + 1}</span>
                  {medications.length > 1 && (
                    <button onClick={() => removeMedication(i)}
                      className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Medicine name" value={med.name}
                    onChange={(e) => updateMedication(i, 'name', e.target.value)}
                    className="rounded-xl border-gray-200 bg-white" />
                  <Input placeholder="Dosage (e.g. 500mg)" value={med.dosage}
                    onChange={(e) => updateMedication(i, 'dosage', e.target.value)}
                    className="rounded-xl border-gray-200 bg-white" />
                  <Input placeholder="Frequency (e.g. 3x daily)" value={med.frequency}
                    onChange={(e) => updateMedication(i, 'frequency', e.target.value)}
                    className="rounded-xl border-gray-200 bg-white" />
                  <Input placeholder="Duration (e.g. 7 days)" value={med.duration}
                    onChange={(e) => updateMedication(i, 'duration', e.target.value)}
                    className="rounded-xl border-gray-200 bg-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Additional Instructions</h3>
          <textarea
            placeholder="Any special instructions for the patient..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </motion.div>

        <Button onClick={handleSave} disabled={saving}
          className="w-full gradient-primary text-white border-0 rounded-xl py-6 text-lg">
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save Prescription'}
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritePrescriptionPage />
    </Suspense>
  );
}