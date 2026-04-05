'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, FileText, Upload, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await api.get(`/medical-records/patient/${user.id}`);
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!fileName || !fileUrl) return;
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.post('/medical-records', {
        patient_id: user.id,
        uploaded_by: user.id,
        file_name: fileName,
        file_url: fileUrl,
        description,
        file_type: 'document',
      });
      setFileName(''); setFileUrl(''); setDescription('');
      setShowForm(false);
      fetchRecords();
    } catch {
      alert('Failed to add record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/medical-records/${id}`);
      fetchRecords();
    } catch {
      alert('Failed to delete');
    }
  };

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
            <span className="text-xl font-semibold text-gradient">Medical Records</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Medical Records</h1>
            <p className="text-gray-500">Your health documents and reports</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}
            className="gradient-primary text-white border-0 rounded-xl">
            <Upload className="w-4 h-4 mr-2" /> Add Record
          </Button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Record</h3>
            <div className="space-y-3">
              <Input placeholder="File name (e.g. Blood Test Report)"
                value={fileName} onChange={(e) => setFileName(e.target.value)}
                className="rounded-xl border-gray-200" />
              <Input placeholder="File URL (paste link to your document)"
                value={fileUrl} onChange={(e) => setFileUrl(e.target.value)}
                className="rounded-xl border-gray-200" />
              <Input placeholder="Description (optional)"
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl border-gray-200" />
              <div className="flex gap-3">
                <Button onClick={handleAdd} disabled={saving}
                  className="gradient-primary text-white border-0 rounded-xl">
                  {saving ? 'Saving...' : 'Save Record'}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline"
                  className="rounded-xl">Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading records...</div>
        ) : records.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No records yet</h3>
            <p className="text-gray-400 text-sm">Add your medical documents and reports here</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {records.map((record, i) => (
              <motion.div key={record.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{record.file_name}</h3>
                  {record.description && (
                    <p className="text-gray-500 text-sm">{record.description}</p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-xl text-sm">View</Button>
                  </a>
                  <button onClick={() => handleDelete(record.id)}
                    className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}